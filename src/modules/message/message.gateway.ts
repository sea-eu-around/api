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
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { WsAuthUser } from '../../decorators/ws-auth-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { WsJwtAuthGuard } from '../../guards/wsJwtAuth.guard';
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
    private _onlineUsers: Set<any>;

    constructor(private readonly _profileRoomRepository: ProfileRoomRepository, private readonly _jwtService: JwtService, private readonly _userService: UserService, private readonly _roomRepository: RoomRepository){
        this._logger = new Logger('MessageGateway');
        this._onlineUsers = new Set();

    }

    @SubscribeMessage('sendMessage')
    async sendMessage(@WsAuthUser() user: UserEntity, @MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
        const room = await this._roomRepository.findOne({where: {id: data.roomId}, relations: ['profiles']})
        return this.server.to(data.roomId).emit('receiveMessage', data);
        
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(@WsAuthUser() user: UserEntity, @MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket): Promise<void> {
        const isProfileInRoom = await this._profileRoomRepository.isProfileInRoom(user.id, data.roomId)
        if (data.roomId !== user.id && !isProfileInRoom) {
            throw new WsException('Forbidden');
        }

        client.join(data.roomId);

        this._onlineUsers[user.id] = data.roomId;
        this._logger.log(this._onlineUsers);

        client.emit('joinedRoom', data.roomId);
    }

    @SubscribeMessage('leaveRoom')
    public leaveRoom(@WsAuthUser() user: UserEntity, @MessageBody() data: JoinRoomDto, @ConnectedSocket() client: Socket): void {
        client.leave(data.roomId);

        this._onlineUsers[user.id] = data.roomId;
        this._logger.log(this._onlineUsers);

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

        this._onlineUsers[user.id] = client.id;
        this._logger.log(this._onlineUsers);

        return this._logger.log(`Client connected: ${client.id}`);
    }
}
