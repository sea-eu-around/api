import { Injectable } from '@nestjs/common';
import { MoreThan } from 'typeorm';

import { OfferEntity } from '../../entities/offer.entity';
import { OfferRepository } from '../../repositories/offer.repository';
import { GetOffersQueryDto } from './dto/GetOffersQueryDto';

@Injectable()
export class OfferService {
    constructor(private _offerRepository: OfferRepository) {}

    async getMany(query?: GetOffersQueryDto): Promise<OfferEntity[]> {
        if (query && query.date) {
            return this._offerRepository.find({
                where: { updatedAt: MoreThan(query.date) },
            });
        }

        return this._offerRepository.find();
    }
}
