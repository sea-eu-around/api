import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    TableInheritance,
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { ProfileType } from '../common/constants/profile-type';
import { ProfileDto } from '../dto/ProfileDto';
import { InterestEntity } from './interest.entity';
import { UserEntity } from './user.entity';

@Entity('profile')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: ProfileType } })
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

    @ManyToMany(() => InterestEntity, { cascade: true })
    @JoinTable({
        name: 'profile_use_interest',
        joinColumn: { name: 'interest_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'profile_id', referencedColumnName: 'id' },
    })
    interests: InterestEntity[];

    dtoClass = ProfileDto;
}
