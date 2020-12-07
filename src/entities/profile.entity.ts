import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    TableInheritance,
} from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { GenderType } from '../common/constants/gender-type';
import { NationalityType } from '../common/constants/nationality-type';
import { ProfileType } from '../common/constants/profile-type';
import { PartnerUniversity } from '../common/constants/sea';
import { ProfileDto } from '../dto/ProfileDto';
import { EducationFieldEntity } from './educationField.entity';
import { InterestEntity } from './interest.entity';
import { LanguageEntity } from './language.entity';
import { MatchingEntity } from './matching.entity';
import { MessageEntity } from './message.entity';
import { ProfileOfferEntity } from './profileOffer.entity';
import { ProfileRoomEntity } from './profileRoom.entity';
import { UserEntity } from './user.entity';

@Entity('profile')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: ProfileType } })
export abstract class ProfileEntity extends AbstractCompositeEntity<ProfileDto> {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ProfileType })
    type: ProfileType;

    @OneToOne(() => UserEntity, (user) => user.profile, {
        cascade: true,
        primary: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id' })
    user: UserEntity;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false, type: 'enum', enum: PartnerUniversity })
    university: PartnerUniversity;

    @ManyToMany(() => InterestEntity, (interests) => interests.profile, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinTable()
    interests: InterestEntity[];

    @Column({ nullable: false, type: 'timestamp without time zone' })
    birthdate: Date;

    @Column({ nullable: true })
    avatar?: string;

    @OneToMany(
        () => EducationFieldEntity,
        (educationField) => educationField.profile,
        {
            eager: true,
            onDelete: 'CASCADE',
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
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    languages: LanguageEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.fromProfile, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    givenLikes: MatchingEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.fromProfile, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    receivedLikes: MatchingEntity[];

    @OneToMany(
        () => ProfileOfferEntity,
        (profileOffer) => profileOffer.profile,
        { eager: true, onDelete: 'CASCADE' },
    )
    profileOffers: ProfileOfferEntity[];

    @OneToMany(() => MessageEntity, (message) => message.sender, {
        onDelete: 'CASCADE',
    })
    messages: MessageEntity[];

    @OneToMany(() => ProfileRoomEntity, (profileRoom) => profileRoom.profile, {
        onDelete: 'CASCADE',
    })
    rooms: ProfileRoomEntity[];

    dtoClass = ProfileDto;
}
