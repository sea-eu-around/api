import { AfterLoad, Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { RoleType } from '../common/constants/role-type';
import { UserDto } from '../dto/UserDto';
import { IProfile } from './interfaces/profile.interface';
import { StudentProfileEntity } from './studentProfile.entity';
import { TeacherProfileEntity } from './teacherProfile.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @OneToOne(
        () => StudentProfileEntity,
        (studentProfile) => studentProfile.user,
    )
    studentProfile?: StudentProfileEntity;

    @OneToOne(
        () => TeacherProfileEntity,
        (teacherProfile) => teacherProfile.user,
    )
    teacherProfile?: TeacherProfileEntity;

    profile: IProfile;

    @AfterLoad()
    defineProfile(): void {
        this.profile = this.studentProfile || this.teacherProfile;
        delete this.studentProfile;
        delete this.teacherProfile;
    }

    dtoClass = UserDto;
}
