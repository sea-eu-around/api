import { ApiPropertyOptional } from '@nestjs/swagger';

import { OffersCategoryType } from '../common/constants/offers-category-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { OfferEntity } from '../entities/offer.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileOfferDto } from './ProfileOfferDto';

export class OfferDto extends AbstractDto {
    @ApiPropertyOptional()
    key: string;

    @ApiPropertyOptional()
    category: OffersCategoryType;

    @ApiPropertyOptional()
    allowChooseProfile: boolean;

    @ApiPropertyOptional()
    allowChooseGender: boolean;

    @ApiPropertyOptional()
    allowInterRole: boolean;

    @ApiPropertyOptional()
    profileOffers: ProfileOfferDto[];

    constructor(offer: OfferEntity) {
        super(offer);
        this.key = offer.key;
        this.category = offer.category;
        this.allowChooseProfile = offer.allowChooseProfile;
        this.allowChooseGender = offer.allowChooseGender;
        this.allowInterRole = offer.allowInterRole;
        this.profileOffers = UtilsService.isDtos(offer.profileOffers)
            ? offer.profileOffers.toDtos()
            : offer.profileOffers;
    }
}
