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
import { GenderType } from '../common/constants/gender-type';
import { NationalityType } from '../common/constants/nationality-type';
import { ProfileType } from '../common/constants/profile-type';
import { ProfileDto } from '../dto/ProfileDto';
import { InterestEntity } from './interest.entity';
import { UserEntity } from './user.entity';

@Entity('profile')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: ProfileType } })
export abstract class ProfileEntity extends AbstractEntity<ProfileDto> {
    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
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

    @Column({ nullable: false })
    birthdate: Date;

    @Column({ type: 'enum', enum: GenderType, default: GenderType.OTHER })
    gender: GenderType;

    @Column({
        type: 'enum',
        enum: NationalityType,
        default: NationalityType.FR,
    })
    nationality: NationalityType;

    dtoClass = ProfileDto;
}
