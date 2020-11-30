import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { UserModule } from '../user/user.module';
import { MessageGateway } from './message.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProfileRoomRepository, RoomRepository]),
        forwardRef(() => UserModule),
    ],
    providers: [MessageGateway],
})
export class MessageModule {}
