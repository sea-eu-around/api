import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
} from 'class-validator';

import { DegreeType } from '../../../common/constants/degree-type';
import { GenderType } from '../../../common/constants/gender-type';
import { NationalityType } from '../../../common/constants/nationality-type';
import { ProfileType } from '../../../common/constants/profile-type';
import { StaffRoleType } from '../../../common/constants/staff-role-type';
import { AddEducationFieldToProfileDto } from './AddEducationFieldToProfileDto';
import { AddLanguageToProfileDto } from './AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './AddOfferToProfileDto';

export class ProfileCreationDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsEnum(GenderType)
    gender: GenderType;

    @ApiProperty()
    @IsString()
    birthdate: Date;

    @ApiProperty()
    @IsEnum(NationalityType)
    nationality: NationalityType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    languages: AddLanguageToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    educationFields: AddEducationFieldToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    interests: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    profileOffers: AddOfferToProfileDto[];

    @ApiProperty()
    @IsEnum(ProfileType)
    type: ProfileType;

    @ApiProperty()
    @ValidateIf((o) => o.type === ProfileType.STUDENT)
    @IsEnum(DegreeType)
    degree: DegreeType;

    @ApiProperty()
    @ValidateIf((o) => o.type === ProfileType.STAFF)
    @IsEnum(StaffRoleType)
    staffRole: StaffRoleType;
}
