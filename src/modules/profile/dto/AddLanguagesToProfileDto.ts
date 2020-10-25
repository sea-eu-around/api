import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

import { LanguageDto } from '../../../dto/LanguageDto';

export class AddLanguagesToProfileDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    languages: LanguageDto[];
}
