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
import { PolymorphicChildren } from '../polymorphic/decorators';
import { EducationFieldEntity } from './educationField.entity';
import { InterestEntity } from './interest.entity';
import { LanguageEntity } from './language.entity';
import { MatchingEntity } from './matching.entity';
import { MediaEntity } from './media.entity';
import { MessageEntity } from './message.entity';
import { ProfileOfferEntity } from './profileOffer.entity';
import { ProfilePictureEntity } from './profilePicture.entity';
import { ProfileRoomEntity } from './profileRoom.entity';
import { ReportEntity } from './report.entity';
import { UserEntity } from './user.entity';

@Entity('profile')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: ProfileType } })
export abstract class ProfileEntity extends AbstractCompositeEntity<ProfileDto> {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ProfileType })
    type: ProfileType;

    @OneToOne(() => UserEntity, (user) => user.profile, {
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

    @ManyToMany(() => InterestEntity, (interests) => interests.profiles, {
        eager: true,
        cascade: true,
    })
    @JoinTable()
    interests: InterestEntity[];

    @Column({ nullable: false, type: 'timestamp without time zone' })
    birthdate: Date;

    @OneToOne(() => ProfilePictureEntity, {
        eager: true,
        nullable: true,
        cascade: true,
    })
    @JoinColumn()
    avatar?: ProfilePictureEntity;

    @Column({ default: true })
    isActive: boolean;

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
        cascade: true,
        eager: true,
    })
    languages: LanguageEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.fromProfile, {
        cascade: true,
    })
    givenLikes: MatchingEntity[];

    @OneToMany(() => MatchingEntity, (matching) => matching.fromProfile, {
        cascade: true,
    })
    receivedLikes: MatchingEntity[];

    @OneToMany(
        () => ProfileOfferEntity,
        (profileOffer) => profileOffer.profile,
        { eager: true, cascade: true },
    )
    profileOffers: ProfileOfferEntity[];

    @OneToMany(() => MessageEntity, (message) => message.sender, {
        cascade: true,
    })
    messages: MessageEntity[];

    @OneToMany(() => ProfileRoomEntity, (profileRoom) => profileRoom.profile, {
        cascade: true,
    })
    rooms: ProfileRoomEntity[];

    @OneToMany(() => ReportEntity, (report) => report.profile, {
        cascade: true,
    })
    reports: ReportEntity[];

    @OneToMany(() => MediaEntity, (media) => media.creator, { cascade: true })
    medias: MediaEntity[];

    @PolymorphicChildren(() => ReportEntity, {
        eager: false,
    })
    receivedReports: ReportEntity[];

    dtoClass = ProfileDto;
}
