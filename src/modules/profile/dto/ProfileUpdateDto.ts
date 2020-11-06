import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { EducationFieldType } from '../../../common/constants/education-field-type';
import { GenderType } from '../../../common/constants/gender-type';
import { NationalityType } from '../../../common/constants/nationality-type';
import { ProfileType } from '../../../common/constants/profile-type';
import { StaffRoleType } from '../../../common/constants/staff-role-type';
import { AddLanguageToProfileDto } from './AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './AddOfferToProfileDto';

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
    @IsEnum(EducationFieldType)
    educationField: EducationFieldType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(NationalityType)
    nationality: NationalityType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsOptional()
    @IsArray()
    @ValidateNested()
    languages: AddLanguageToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    interests: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @ValidateNested()
    profileOffers: AddOfferToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(ProfileType)
    type: ProfileType;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateIf((o) => o.type === ProfileType.STUDENT)
    @IsEnum(DegreeType)
    degree: DegreeType;

    @ApiProperty()
    @IsOptional()
    @ValidateIf((o) => o.type === ProfileType.STAFF)
    @IsEnum(StaffRoleType)
    staffRole: StaffRoleType;
}
