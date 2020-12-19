import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
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

export class ProfileCreationDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({ enum: GenderType })
    @IsEnum(GenderType)
    gender: GenderType;

    @ApiProperty()
    @IsDateString()
    birthdate: Date;

    @ApiProperty({ enum: NationalityType })
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

    @ApiProperty({ enum: ProfileType })
    @IsEnum(ProfileType)
    type: ProfileType;

    @ApiProperty({ enum: DegreeType })
    @ValidateIf((o) => o.type === ProfileType.STUDENT)
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
