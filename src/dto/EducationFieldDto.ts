import { ApiPropertyOptional } from '@nestjs/swagger';

import { EducationFieldType } from '../common/constants/education-field-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { EducationFieldEntity } from '../entities/educationField.entity';

export class EducationFieldDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    id: EducationFieldType;

    constructor(educationField: EducationFieldEntity) {
        super();
        this.id = educationField.id;
    }
}
