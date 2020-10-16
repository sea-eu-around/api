import { ChildEntity, Column } from 'typeorm';

import { DegreeType } from '../common/constants/degree-type';
import { ProfileType } from '../common/constants/profile-type';
import { StudentProfileDto } from '../dto/StudentProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(ProfileType.STUDENT)
export class StudentProfileEntity extends ProfileEntity {
    @Column({ nullable: false, type: 'enum', enum: DegreeType })
    level: DegreeType;

    dtoClass = StudentProfileDto;
}
