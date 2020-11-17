import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';

import { DegreeType } from '../../../common/constants/degree-type';
import { LanguageType } from '../../../common/constants/language-type';
import { PartnerUniversity } from '../../../common/constants/sea';

export class ProfileQueryDto {
    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;

    @IsOptional()
    @IsArray()
    @IsEnum(PartnerUniversity, { each: true })
    @Transform((value: string) => value.split(','))
    universities?: PartnerUniversity[];

    @IsOptional()
    @IsArray()
    @IsEnum(LanguageType, { each: true })
    @Transform((value: string) => value.split(','))
    spokenLanguages?: LanguageType[];

    @IsOptional()
    @IsArray()
    @IsEnum(DegreeType, { each: true })
    @Transform((value: string) => value.split(','))
    degrees?: DegreeType[];
}
