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
import { AddLanguageToProfileDto } from './AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './AddOfferToProfileDto';

export abstract class ProfileCreationDto {
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
    @IsEnum(EducationFieldType)
    educationField: EducationFieldType;

    @ApiProperty()
    @IsEnum(NationalityType)
    nationality: NationalityType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @ValidateNested()
    languages: AddLanguageToProfileDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    interests: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @ValidateNested()
    profileOffers: AddOfferToProfileDto[];

    @ApiProperty()
    @IsEnum(ProfileType)
    type: ProfileType;

    @ApiProperty()
    @ValidateIf((o) => o.type === ProfileType.STUDENT)
    @IsEnum(DegreeType)
    degree: DegreeType;
}
