import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { RoleType } from '../common/constants/role-type';
import { UserDto } from '../dto/UserDto';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @OneToOne(() => ProfileEntity, (profile) => profile.id)
    profile: ProfileEntity;

    dtoClass = UserDto;
}
