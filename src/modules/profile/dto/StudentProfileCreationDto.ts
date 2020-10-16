import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { DegreeType } from '../../../common/constants/degree-type';
import { ProfileCreationDto } from './ProfileCreationDto';

export class StudentProfileCreationDto extends ProfileCreationDto {
    @ApiProperty()
    @IsEnum(DegreeType)
    degree: DegreeType;
}
