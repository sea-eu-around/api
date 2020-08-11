import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { StudentProfileDto } from '../dto/StudentProfileDto';
import { IProfile } from './interfaces/profile.interface';
import { UserEntity } from './user.entity';

@Entity({ name: 'student_profile' })
export class StudentProfileEntity extends AbstractEntity<StudentProfileDto>
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

    @OneToOne(() => UserEntity, (user) => user.studentProfile)
    @JoinColumn()
    user: UserEntity;

    dtoClass = StudentProfileDto;
}
