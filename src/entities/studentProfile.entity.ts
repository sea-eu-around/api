import { Column, Entity } from 'typeorm';

import { StudentProfileDto } from '../dto/StudentProfileDto';
import { ProfileEntity } from './abstract/profile.entity';

@Entity({ name: 'student_profile' })
export class StudentProfileEntity extends ProfileEntity {
    @Column()
    level: string;

    dtoClass = StudentProfileDto;
}
