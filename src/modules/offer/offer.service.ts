import { Injectable } from '@nestjs/common';

import { OfferEntity } from '../../entities/offer.entity';
import { OfferRepository } from '../../repositories/offer.repository';

@Injectable()
export class OfferService {
    constructor(private _offerRepository: OfferRepository) {}

    async getMany(): Promise<OfferEntity[]> {
        return this._offerRepository.find();
    }
}
