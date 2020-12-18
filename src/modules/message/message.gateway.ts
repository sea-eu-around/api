/* eslint-disable */
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { WsAuthUser } from '../../decorators/ws-auth-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { WsJwtAuthGuard } from '../../guards/wsJwtAuth.guard';
import { ISocketUser } from '../../interfaces/ISocketUser';
import { MessageRepository } from '../../repositories/message.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { IsWritingDto } from './dto/IsWritingDto';
import { JoinRoomDto } from './dto/JoinRoomDto';
import { ReadMessageDto } from './dto/ReadMessageDto';
import { SendMessageDto } from './dto/SendMessageDto';

@WebSocketGateway({ namespace: '/chat' })
@UseGuards(WsJwtAuthGuard)
export class MessageGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private _logger: Logger;
    private _onlineProfiles: Set<ISocketUser>;
    private _expo: Expo = new Expo();

    constructor(
        private readonly _profileRoomRepository: ProfileRoomRepository,
        private readonly _jwtService: JwtService,
        private readonly _userService: UserService,
        private readonly _roomRepository: RoomRepository,
        private readonly _messageRepository: MessageRepository,
        private readonly _userRepository: UserRepository,
        private readonly _profileRepository: ProfileRepository,
    ){
        this._logger = new Logger('MessageGateway');
        this._onlineProfiles = new Set();
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(@WsAuthUser() user: UserEntity, @MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket): Promise<any> {
        const room = await this._roomRepository.findOne({where: {id: data.roomId}, relations: ['profiles']})
        const roomProfileIds = room.profiles.map(x => x.profileId);   

        // Create the message
        let message = this._messageRepository.create({...data, senderId: user.id})
        message = await this._messageRepository.save(message);

        // Update the last message of the room
        room.lastMessage = message;
        await this._roomRepository.save(room);

        // Get the ids of the rooms to which the event must be sent
        let roomIds = this._getWhereToEmitEvent(data.roomId, roomProfileIds);

        this._emitToRooms(roomIds, 'receiveMessage', message.toDto())

        // Get ids of offline profiles and ids of online profiles but in an other room (conversation)
        const offlineOrInOtherRoomProfileIds = roomProfileIds.filter(profileId => (profileId in this._onlineProfiles && this._onlineProfiles[profileId].roomId !== data.roomId && this._onlineProfiles[profileId].roomId !== this._onlineProfiles[profileId].socketId) || !(profileId in this._onlineProfiles));

        const offlineOrInOtherRoomUsersIds = await this._userRepository.findByIds(offlineOrInOtherRoomProfileIds);
        const sender = await this._profileRepository.findOne(user.id);

        const notifications: ExpoPushMessage[] = [];

        for(const user of offlineOrInOtherRoomUsersIds){
            notifications.push({
                to: user.expoPushToken || user.email,
                sound: 'default',
                body: `${sender.firstName} ${sender.lastName}: ${data.text}`,
                data
            });
        }

        await this._expo.sendPushNotificationsAsync(notifications);
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(@WsAuthUser() user: UserEntity, @MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket): Promise<void> {
        const isProfileInRoom = await this._profileRoomRepository.isProfileInRoom(user.id, data.roomId)

        if (data.roomId !== user.id && !isProfileInRoom) {
            throw new WsException('Forbidden');
        }

        client.join(data.roomId);

        this._onlineProfiles[user.id] = {socketId: client.id, roomId: data.roomId};;
        this._logger.log(this._onlineProfiles);

        client.emit('joinedRoom', data.roomId);
    }

    @SubscribeMessage('leaveRoom')
    public leaveRoom(@WsAuthUser() user: UserEntity, @MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket): void {
        client.leave(data.roomId);

        this._onlineProfiles[user.id] = {socketId: client.id, roomId: client.id};;
        this._logger.log(this._onlineProfiles);

        client.emit('leftRoom', data.roomId);
    }

    @SubscribeMessage('isWriting')
    isWriting(@WsAuthUser() user: UserEntity, @MessageBody() data: IsWritingDto): void {
        this.server.to(data.roomId).emit('isWriting', {profileId: user.id, ...data})
    }

    @SubscribeMessage('readMessage')
    async readMessage(@WsAuthUser() user: UserEntity, @MessageBody() data: ReadMessageDto): Promise<void> {
        const profileRoom = await this._profileRoomRepository.findOne({profileId: user.id, roomId: data.roomId});
        profileRoom.lastMessageSeenDate = data.date;
        profileRoom.lastMessageSeenId = data.messageId;
        await this._profileRoomRepository.save(profileRoom);

        const profileIds = await this._profileRoomRepository.getRoomProfileIds(data.roomId);
        const roomIds = this._getWhereToEmitEvent(data.roomId, profileIds);

        this._emitToRooms(roomIds, 'readMessage', {profileId: user.id, ...data});
    }

    afterInit(server: Server): void {
        return this._logger.log('Init');
    }

    async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
        const { iat, exp, id: userId } = this._jwtService.verify(client.handshake.query['authorization']) 

        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new WsException('Unauthorized');
        }
        const user = await this._userService.findOne(userId);

        if (!user) {
            throw new WsException('Unauthorized');
        }

        delete this._onlineProfiles[user.id];
        this._logger.log(this._onlineProfiles);

        return this._logger.log(`Client disconnected: ${client.id}`);
    }

    async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
        const { iat, exp, id: userId } = this._jwtService.verify(client.handshake.query['authorization']) 

        const timeDiff = exp - iat;
        if (timeDiff <= 0) {
            throw new WsException('Unauthorized');
        }
        const user = await this._userService.findOne(userId);

        if (!user) {
            throw new WsException('Unauthorized');
        }

        this._onlineProfiles[user.id] = {socketId: client.id, roomId: client.id};
        this._logger.log(this._onlineProfiles);

        return this._logger.log(`Client connected: ${client.id}`);
    }

    private _getWhereToEmitEvent(roomId: string, roomProfileIds: string[]): Set<string>{
        let roomIds: Set<string> = new Set();
        for(const profileId of roomProfileIds){
            if(profileId in this._onlineProfiles){
                if(this._onlineProfiles[profileId].roomId === roomId){
                    roomIds.add(roomId);
                }else{
                    roomIds.add(this._onlineProfiles[profileId].socketId);
                }
            }
        }

        return roomIds;
    }

    private _emitToRooms(roomIds: Set<string>, eventName: string, data: any){
        let event = this.server
        for(const roomId of roomIds){
            event = event.to(roomId);
        }
        event.emit(eventName, data);
    }
}
