import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { LanguageLevelType } from '../../../common/constants/language-level-type';
import { LanguageType } from '../../../common/constants/language-type';

export class AddLanguageToProfileDto {
    @ApiProperty()
    @IsEnum(LanguageType)
    code: LanguageType;

    @ApiProperty()
    @IsEnum(LanguageLevelType)
    level: LanguageLevelType;
}
