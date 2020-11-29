import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomRepository } from '../../repositories/room.repository';
import { UserRoomRepository } from '../../repositories/userRoom.repository';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoomRepository, UserRoomRepository])],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
