import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DegreeType } from '../../../common/constants/degree-type';
import { LanguageType } from '../../../common/constants/language-type';
import { PartnerUniversity } from '../../../common/constants/sea';

export class ProfileFiltersDto {
    @ApiProperty({
        enum: PartnerUniversity,
        isArray: true,
    })
    @IsArray()
    universities: PartnerUniversity[];

    @ApiProperty({ enum: LanguageType, isArray: true })
    @IsArray()
    spokenLanguages: LanguageType[];

    @ApiProperty({ enum: DegreeType, isArray: true })
    @IsArray()
    levelOfStudy: DegreeType[];
}
