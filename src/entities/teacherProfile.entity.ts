import { ChildEntity } from 'typeorm';

import { RoleType } from '../common/constants/role-type';
import { TeacherProfileDto } from '../dto/TeacherProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(RoleType.TEACHER)
export class TeacherProfileEntity extends ProfileEntity {
    dtoClass = TeacherProfileDto;
}
