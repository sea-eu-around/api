import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OfferRepository } from '../../repositories/offer.repository';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
    imports: [TypeOrmModule.forFeature([OfferRepository])],
    controllers: [OfferController],
    exports: [OfferService],
    providers: [OfferService],
})
export class OfferModule {}
