import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { LanguageLevelType } from '../../../common/constants/language-level-type';
import { LanguageType } from '../../../common/constants/language-type';

export class AddLanguageToProfileDto {
    @ApiProperty({ enum: LanguageType })
    @IsEnum(LanguageType)
    code: LanguageType;

    @ApiProperty({ enum: LanguageLevelType })
    @IsEnum(LanguageLevelType)
    level: LanguageLevelType;
}
