import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { TeacherProfileDto } from '../dto/TeacherProfileDto';
import { IProfile } from './interfaces/profile.interface';
import { UserEntity } from './user.entity';

@Entity({ name: 'teacher_profile' })
export class TeacherProfileEntity extends AbstractEntity<TeacherProfileDto>
    implements IProfile {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    city: string;

    @Column()
    university: string;

    @OneToOne(() => UserEntity, (user) => user.teacherProfile)
    @JoinColumn()
    user: UserEntity;

    dtoClass = TeacherProfileDto;
}
