import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoomRepository, ProfileRoomRepository]),
    ],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
