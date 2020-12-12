import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';
import { UserRepository } from '../user/user.repository';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MatchingRepository,
            UserRepository,
            ProfileRoomRepository,
            RoomRepository,
        ]),
    ],
    providers: [MatchingService],
    controllers: [MatchingController],
    exports: [MatchingService],
})
export class MatchingModule {}
