/* eslint-disable */
import { Logger, UnauthorizedException, UnprocessableEntityException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
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
    WsResponse,
} from '@nestjs/websockets';
import { profile } from 'console';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { WsAuthUser } from '../../decorators/ws-auth-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { WsJwtAuthGuard } from '../../guards/wsJwtAuth.guard';
import { MessageRepository } from '../../repositories/message.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { UserService } from '../user/user.service';
import { JoinRoomDto } from './dto/JoinRoomDto';
import { SendMessageDto } from './dto/SendMessageDto';

@WebSocketGateway({ namespace: '/chat' })
@UseGuards(WsJwtAuthGuard)
export class MessageGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private _logger: Logger;
    private _onlineProfiles: Set<any>;

    constructor(private readonly _profileRoomRepository: ProfileRoomRepository, private readonly _jwtService: JwtService, private readonly _userService: UserService, private readonly _roomRepository: RoomRepository, private readonly _messageRepository: MessageRepository){
        this._logger = new Logger('MessageGateway');
        this._onlineProfiles = new Set();

    }

    @SubscribeMessage('sendMessage')
    async sendMessage(@WsAuthUser() user: UserEntity, @MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
        const room = await this._roomRepository.findOne({where: {id: data.roomId}, relations: ['profiles']})
        const offlineProfileIds = room.profiles.map(x => x.profileId).filter(profileId => profileId in this._onlineProfiles);

        // TODO: send notification to offline profile

        let message = this._messageRepository.create()
        message.id = data.id;
        message.text = data.text;
        message.roomId = data.roomId;
        message.senderId = user.id;
        message.sent = true;
        message = await this._messageRepository.save(message);

        room.lastMessage = message;
        await this._roomRepository.save(room);

        return this.server.to(data.roomId).emit('receiveMessage', message.toDto());
        
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(@WsAuthUser() user: UserEntity, @MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket): Promise<void> {
        const isProfileInRoom = await this._profileRoomRepository.isProfileInRoom(user.id, data.roomId)
        console.log(isProfileInRoom);
        if (data.roomId !== user.id && !isProfileInRoom) {
            throw new WsException('Forbidden');
        }

        client.join(data.roomId);

        this._onlineProfiles[user.id] = data.roomId;
        this._logger.log(this._onlineProfiles);

        client.emit('joinedRoom', data.roomId);
    }

    @SubscribeMessage('leaveRoom')
    public leaveRoom(@WsAuthUser() user: UserEntity, @MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket): void {
        client.leave(data.roomId);

        this._onlineProfiles[user.id] = data.roomId;
        this._logger.log(this._onlineProfiles);

        client.emit('leftRoom', data.roomId);
    }

    public afterInit(server: Server): void {
        return this._logger.log('Init');
    }

    public handleDisconnect(@ConnectedSocket() client: Socket): void {
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

        this._onlineProfiles[user.id] = client.id;
        this._logger.log(this._onlineProfiles);

        return this._logger.log(`Client connected: ${client.id}`);
    }
}
