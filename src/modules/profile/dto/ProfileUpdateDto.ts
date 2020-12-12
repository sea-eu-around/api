import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
    ValidateNested,
} from 'class-validator';

import { DegreeType } from '../../../common/constants/degree-type';
import { GenderType } from '../../../common/constants/gender-type';
import { NationalityType } from '../../../common/constants/nationality-type';
import { ProfileType } from '../../../common/constants/profile-type';
import { AddEducationFieldToProfileDto } from './AddEducationFieldToProfileDto';
import { AddLanguageToProfileDto } from './AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './AddOfferToProfileDto';
import { AddStaffRolesToProfileDto } from './AddStaffRolesToProfileDto';

export class ProfileUpdateDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(GenderType)
    gender: GenderType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    birthdate: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(NationalityType)
    nationality: NationalityType;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => AddLanguageToProfileDto)
    languages: AddLanguageToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => AddEducationFieldToProfileDto)
    educationFields: AddEducationFieldToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    interests: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => AddOfferToProfileDto)
    profileOffers: AddOfferToProfileDto[];

    @ApiProperty()
    @IsEnum(ProfileType)
    type: ProfileType;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.type === ProfileType.STUDENT)
    @IsOptional()
    @IsEnum(DegreeType)
    degree: DegreeType;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.type === ProfileType.STAFF)
    @ValidateNested()
    @Type(() => AddStaffRolesToProfileDto)
    staffRoles: AddStaffRolesToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatar: string;
}
