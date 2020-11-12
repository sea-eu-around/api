import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EducationFieldType } from '../../../common/constants/education-field-type';

export class AddEducationFieldToProfileDto {
    @ApiProperty()
    @IsEnum(EducationFieldType)
    id: EducationFieldType;
}
