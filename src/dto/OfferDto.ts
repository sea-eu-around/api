import { ApiPropertyOptional } from '@nestjs/swagger';

import { OffersCategoryType } from '../common/constants/offers-category-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { OfferEntity } from '../entities/offer.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileOfferDto } from './ProfileOfferDto';

export class OfferDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    id: string;

    @ApiPropertyOptional()
    category: OffersCategoryType;

    @ApiPropertyOptional()
    allowChooseProfileType: boolean;

    @ApiPropertyOptional()
    allowChooseGender: boolean;

    @ApiPropertyOptional()
    allowInterRole: boolean;

    @ApiPropertyOptional()
    profileOffers: ProfileOfferDto[];

    constructor(offer: OfferEntity) {
        super();
        this.id = offer.id;
        this.category = offer.category;
        this.allowChooseProfileType = offer.allowChooseProfileType;
        this.allowChooseGender = offer.allowChooseGender;
        this.allowInterRole = offer.allowInterRole;
        this.profileOffers = UtilsService.isDtos(offer.profileOffers)
            ? offer.profileOffers.toDtos()
            : offer.profileOffers;
    }
}
