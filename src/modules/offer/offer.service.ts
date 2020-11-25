import { Injectable } from '@nestjs/common';

import { OfferEntity } from '../../entities/offer.entity';
import { OfferRepository } from '../../repositories/offer.repository';
import { GetOffersQueryDto } from './dto/GetOffersQueryDto';

@Injectable()
export class OfferService {
    constructor(private _offerRepository: OfferRepository) {}

    async getMany(query?: GetOffersQueryDto): Promise<OfferEntity[]> {
        const offers = await this._offerRepository.find();

        if (query && query.updatedAt) {
            if (
                offers.find(
                    (offer) => offer.updatedAt > new Date(query.updatedAt),
                )
            ) {
                return offers;
            }

            return [];
        }

        return offers;
    }
}
