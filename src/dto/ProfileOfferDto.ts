import { ApiPropertyOptional } from '@nestjs/swagger';

import { GenderType } from '../common/constants/gender-type';
import { ProfileType } from '../common/constants/profile-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ProfileOfferEntity } from '../entities/profileOffer.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';

export class ProfileOfferDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    profile: ProfileDto;

    @ApiPropertyOptional()
    offerId: string;

    @ApiPropertyOptional()
    allowProfileType: ProfileType;

    @ApiPropertyOptional()
    allowGender: GenderType;

    constructor(profileOffer: ProfileOfferEntity) {
        super();
        this.allowProfileType = profileOffer.allowProfileType;
        this.allowGender = profileOffer.allowGender;
        this.profile = UtilsService.isDto(profileOffer.profile)
            ? profileOffer.profile.toDto()
            : profileOffer.profile;
        this.offerId = profileOffer.offerId;
    }
}
