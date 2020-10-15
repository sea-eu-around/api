import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    TableInheritance,
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { GenderType } from '../common/constants/gender-type';
import { NationalityType } from '../common/constants/nationality-type';
import { ProfileType } from '../common/constants/profile-type';
import { ProfileDto } from '../dto/ProfileDto';
import { InterestEntity } from './interest.entity';
import { ProfileToLanguageEntity } from './profileToLanguage.entity';
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

    @ManyToMany(() => InterestEntity, (interests) => interests.profile)
    @JoinTable()
    interests: InterestEntity[];

    @Column({ nullable: false })
    birthdate: Date;

    @Column({ type: 'enum', enum: GenderType, default: GenderType.OTHER })
    gender: GenderType;

    @Column({
        type: 'enum',
        enum: NationalityType,
    })
    nationality: NationalityType;

    @OneToMany(
        () => ProfileToLanguageEntity,
        (profileToLanguage) => profileToLanguage.profile,
    )
    profileToLanguages: ProfileToLanguageEntity[];

    dtoClass = ProfileDto;
}
