import { ApiPropertyOptional } from '@nestjs/swagger';

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
    allowStaff?: boolean;

    @ApiPropertyOptional()
    allowStudent?: boolean;

    @ApiPropertyOptional()
    allowMale?: boolean;

    @ApiPropertyOptional()
    allowFemale?: boolean;

    @ApiPropertyOptional()
    allowOther?: boolean;

    constructor(profileOffer: ProfileOfferEntity) {
        super();
        this.allowStaff = profileOffer.allowStaff;
        this.allowStudent = profileOffer.allowStudent;
        this.allowMale = profileOffer.allowMale;
        this.allowFemale = profileOffer.allowFemale;
        this.allowOther = profileOffer.allowOther;
        this.profile = UtilsService.isDto(profileOffer.profile)
            ? profileOffer.profile.toDto()
            : profileOffer.profile;
        this.offerId = profileOffer.offerId;
    }
}
