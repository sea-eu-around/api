import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InterestRepository } from '../../repositories/interest.repository';
import { OfferRepository } from '../../repositories/offer.repository';
import { ProfileModule } from '../profile/profile.module';
import { UserRepository } from '../user/user.repository';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserRepository,
            InterestRepository,
            OfferRepository,
        ]),
        forwardRef(() => ProfileModule),
    ],
    controllers: [SeedController],
    exports: [SeedService],
    providers: [SeedService],
})
export class SeedModule {}
