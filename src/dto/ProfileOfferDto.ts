import { ApiPropertyOptional } from '@nestjs/swagger';

import { GenderType } from '../common/constants/gender-type';
import { ProfileType } from '../common/constants/profile-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ProfileOfferEntity } from '../entities/profileOffer.entity';
import { UtilsService } from '../providers/utils.service';
import { OfferDto } from './OfferDto';
import { ProfileDto } from './ProfileDto';

export class ProfileOfferDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    profile: ProfileDto;

    @ApiPropertyOptional()
    offer: OfferDto;

    @ApiPropertyOptional()
    allowProfile: ProfileType;

    @ApiPropertyOptional()
    allowGender: GenderType;

    constructor(profileOffer: ProfileOfferEntity) {
        super();
        this.allowProfile = profileOffer.allowProfile;
        this.allowGender = profileOffer.allowGender;
        this.profile = UtilsService.isDto(profileOffer.profile)
            ? profileOffer.profile.toDto()
            : profileOffer.profile;
        this.offer = UtilsService.isDto(profileOffer.offer)
            ? profileOffer.offer.toDto()
            : profileOffer.offer;
    }
}
