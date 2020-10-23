import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InterestEntity } from '../../entities/interest.entity';
import { InterestRepository } from '../../repositories/interest.repository';
import { ProfileRepository } from '../../repositories/profile.repository';
import { InterestController } from './interest.controller';
import { InterestService } from './interest.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InterestEntity,
            InterestRepository,
            ProfileRepository,
        ]),
    ],
    providers: [InterestService],
    controllers: [InterestController],
    exports: [InterestService],
})
export class InterestModule {}
