import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ProfileOfferEntity } from '../entities/profileOffer.entity';
import { UtilsService } from '../providers/utils.service';
import { OfferDto } from './OfferDto';
import { ProfileDto } from './ProfileDto';

export class ProfileOfferDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    target: number;

    @ApiPropertyOptional()
    profile: ProfileDto;

    @ApiPropertyOptional()
    offer: OfferDto;

    constructor(profileOffer: ProfileOfferEntity) {
        super();
        this.target = profileOffer.target;
        this.profile = UtilsService.isDto(profileOffer.profile)
            ? profileOffer.profile.toDto()
            : profileOffer.profile;
        this.offer = UtilsService.isDto(profileOffer.offer)
            ? profileOffer.offer.toDto()
            : profileOffer.offer;
    }
}
