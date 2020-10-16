import { ApiPropertyOptional } from '@nestjs/swagger';

import { DegreeType } from '../common/constants/degree-type';
import { StudentProfileEntity } from '../entities/studentProfile.entity';
import { ProfileDto } from './ProfileDto';

export class StudentProfileDto extends ProfileDto {
    @ApiPropertyOptional()
    level: DegreeType;

    constructor(profile: StudentProfileEntity) {
        super(profile);
        this.level = profile.level;
    }
}
