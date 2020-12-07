import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { ProfileOfferDto } from '../dto/ProfileOfferDto';
import { OfferEntity } from './offer.entity';
import { ProfileEntity } from './profile.entity';

@Entity('profile_offer')
export class ProfileOfferEntity extends AbstractCompositeEntity<ProfileOfferDto> {
    @Index()
    @Column()
    @PrimaryColumn()
    profileId!: string;

    @Index()
    @Column()
    @PrimaryColumn()
    offerId!: string;

    @Column({ nullable: true })
    allowStaff?: boolean;

    @Column({ nullable: true })
    allowStudent?: boolean;

    @Column({ nullable: true })
    allowMale?: boolean;

    @Column({ nullable: true })
    allowFemale?: boolean;

    @Column({ nullable: true })
    allowOther?: boolean;

    @ManyToOne(() => ProfileEntity, (profile) => profile.profileOffers, {
        onDelete: 'CASCADE',
    })
    profile: ProfileEntity;

    @ManyToOne(() => OfferEntity, (offer) => offer.profileOffers, {
        eager: true,
        onDelete: 'CASCADE',
    })
    offer: OfferEntity;

    dtoClass = ProfileOfferDto;
}
