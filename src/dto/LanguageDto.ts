import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { LanguageLevelType } from '../common/constants/language-level-type';
import { LanguageType } from '../common/constants/language-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { LanguageEntity } from '../entities/language.entity';

export class LanguageDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    @IsEnum(LanguageEntity)
    code: LanguageType;

    @ApiPropertyOptional()
    @IsEnum(LanguageLevelType)
    level: LanguageLevelType;

    constructor(language: LanguageEntity) {
        super();
        this.code = language.code;
        this.level = language.level;
    }
}
