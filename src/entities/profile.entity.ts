import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    TableInheritance,
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { RoleType } from '../common/constants/role-type';
import { ProfileDto } from '../dto/ProfileDto';
import { UserEntity } from './user.entity';

@Entity('profile')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: RoleType } })
export abstract class ProfileEntity extends AbstractEntity<ProfileDto> {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    university: string;

    @OneToOne(() => UserEntity, (user) => user.profile)
    @JoinColumn()
    user: UserEntity;

    dtoClass = ProfileDto;
}
