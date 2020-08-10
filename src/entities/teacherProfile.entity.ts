import { Column, Entity } from 'typeorm';

import { TeacherProfileDto } from '../dto/TeacherProfileDto';
import { ProfileEntity } from './abstract/profile.entity';

@Entity({ name: 'teacher_profile' })
export class TeacherProfileEntity extends ProfileEntity {
    @Column()
    salary: number;

    dtoClass = TeacherProfileDto;
}
