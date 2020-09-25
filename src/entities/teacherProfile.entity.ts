import { ChildEntity } from 'typeorm';

import { ProfileType } from '../common/constants/profile-type';
import { TeacherProfileDto } from '../dto/TeacherProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(ProfileType.TEACHER)
export class TeacherProfileEntity extends ProfileEntity {
    dtoClass = TeacherProfileDto;
}
