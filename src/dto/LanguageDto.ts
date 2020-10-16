import { ApiPropertyOptional } from '@nestjs/swagger';

import { LanguageLevelType } from '../common/constants/language-level-type';
import { LanguageType } from '../common/constants/language-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { LanguageEntity } from '../entities/language.entity';

export class LanguageDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    code: LanguageType;

    @ApiPropertyOptional()
    level: LanguageLevelType;

    constructor(language: LanguageEntity) {
        super(language);
        Object.assign(this, language);
    }
}
