import { ChildEntity } from 'typeorm';

import { ProfileType } from '../common/constants/profile-type';
import { StudentProfileDto } from '../dto/StudentProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(ProfileType.STUDENT)
export class StudentProfileEntity extends ProfileEntity {
    dtoClass = StudentProfileDto;
}
