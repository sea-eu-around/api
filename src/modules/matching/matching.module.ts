import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchingEntity } from '../../entities/matching.entity';
import { UserEntity } from '../../entities/user.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { UserRepository } from '../user/user.repository';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MatchingEntity,
            MatchingRepository,
            UserEntity,
            UserRepository,
        ]),
    ],
    providers: [MatchingService],
    controllers: [MatchingController],
    exports: [MatchingService],
})
export class MatchingModule {}
