import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';

import { DegreeType } from '../../../common/constants/degree-type';
import { GenderType } from '../../../common/constants/gender-type';
import { LanguageType } from '../../../common/constants/language-type';
import { ProfileType } from '../../../common/constants/profile-type';
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

    @IsOptional()
    @IsArray()
    @IsEnum(GenderType, { each: true })
    @Transform((value: string) => value.split(','))
    gender?: GenderType[];

    @IsOptional()
    @IsArray()
    @IsEnum(ProfileType, { each: true })
    @Transform((value: string) => value.split(','))
    type?: ProfileType[];
}
