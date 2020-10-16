import { ApiPropertyOptional } from '@nestjs/swagger';

import { DegreeType } from '../common/constants/degree-type';
import { StudentProfileEntity } from '../entities/studentProfile.entity';
import { ProfileDto } from './ProfileDto';

export class StudentProfileDto extends ProfileDto {
    @ApiPropertyOptional()
    degree: DegreeType;

    constructor(profile: StudentProfileEntity) {
        super(profile);
        this.degree = profile.degree;
    }
}
