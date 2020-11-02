import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { GenderType } from '../../../common/constants/gender-type';
import { ProfileType } from '../../../common/constants/profile-type';

export class AddOfferToProfileDto {
    @ApiProperty()
    @IsString()
    offerId: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ProfileType)
    allowProfile: ProfileType;

    @ApiProperty()
    @IsOptional()
    @IsEnum(GenderType)
    allowGender: GenderType;
}
