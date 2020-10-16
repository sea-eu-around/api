import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

import { GenderType } from '../../../common/constants/gender-type';
import { NationalityType } from '../../../common/constants/nationality-type';
import { LanguageDto } from '../../../dto/LanguageDto';

export abstract class ProfileCreationDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    university: string;

    @ApiProperty()
    @IsEnum(GenderType)
    gender: GenderType;

    @ApiProperty()
    @IsString()
    birthdate: Date;

    @ApiProperty()
    @IsEnum(NationalityType)
    nationality: NationalityType;

    @ApiProperty()
    @IsArray()
    languages: LanguageDto[];
}
