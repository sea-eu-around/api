import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchingEntity } from '../../entities/matching.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { MatchingRepository } from '../../repositories/matching.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MatchingEntity,
            MatchingRepository,
            ProfileEntity,
            ProfileRepository,
        ]),
    ],
    providers: [MatchingService],
    controllers: [MatchingController],
    exports: [MatchingService],
})
export class MatchingModule {}
