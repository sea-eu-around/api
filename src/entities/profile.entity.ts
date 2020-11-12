import {
    Column,
    Entity,
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
import { PartnerUniversity } from '../common/constants/sea';
import { ProfileDto } from '../dto/ProfileDto';
import { EducationFieldEntity } from './educationField.entity';
import { InterestEntity } from './interest.entity';
import { LanguageEntity } from './language.entity';
import { MatchingEntity } from './matching.entity';
import { ProfileOfferEntity } from './profileOffer.entity';
import { UserEntity } from './user.entity';

@Entity('profile')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: ProfileType } })
export abstract class ProfileEntity extends AbstractEntity<ProfileDto> {
    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false, type: 'enum', enum: PartnerUniversity })
    university: PartnerUniversity;

    @OneToOne(() => UserEntity, (user) => user.profile, { cascade: true })
    user: UserEntity;

    @ManyToMany(() => InterestEntity, (interests) => interests.profile, {
        eager: true,
    })
    @JoinTable()
    interests: InterestEntity[];

    @Column({ nullable: false, type: 'timestamp without time zone' })
    birthdate: Date;

    @OneToMany(
        () => EducationFieldEntity,
        (educationField) => educationField.profile,
        {
            eager: true,
            cascade: true,
        },
    )
    educationFields: EducationFieldEntity[];

    @Column({ type: 'enum', enum: GenderType, default: GenderType.OTHER })
    gender: GenderType;

    @Column({
        type: 'enum',
        enum: NationalityType,
    })
    nationality: NationalityType;

    @OneToMany(() => LanguageEntity, (language) => language.profile, {
        eager: true,
        cascade: true,
    })
    languages: LanguageEntity[];

    @OneToMany(
        () => ProfileOfferEntity,
        (profileOffer) => profileOffer.profile,
        { eager: true, cascade: true },
    )
    profileOffers: ProfileOfferEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.fromProfile, {
        cascade: true,
    })
    givenLikes: MatchingEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.toProfile, {
        cascade: true,
    })
    receivedLikes: MatchingEntity[];

    dtoClass = ProfileDto;
}
