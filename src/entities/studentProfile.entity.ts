import { ChildEntity } from 'typeorm';

import { RoleType } from '../common/constants/role-type';
import { StudentProfileDto } from '../dto/StudentProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(RoleType.STUDENT)
export class StudentProfileEntity extends ProfileEntity {
    dtoClass = StudentProfileDto;
}
