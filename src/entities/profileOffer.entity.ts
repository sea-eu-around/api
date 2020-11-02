import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { GenderType } from '../common/constants/gender-type';
import { ProfileType } from '../common/constants/profile-type';
import { ProfileOfferDto } from '../dto/ProfileOfferDto';
import { OfferEntity } from './offer.entity';
import { ProfileEntity } from './profile.entity';

@Entity('profile_offer')
export class ProfileOfferEntity extends AbstractCompositeEntity<
    ProfileOfferDto
> {
    @Column()
    @PrimaryColumn()
    profileId!: string;

    @Column()
    @PrimaryColumn()
    offerId!: string;

    @Column({ nullable: true, type: 'enum', enum: ProfileType })
    allowProfile: ProfileType;

    @Column({ nullable: true, type: 'enum', enum: GenderType })
    allowGender: GenderType;

    @ManyToOne(() => ProfileEntity, (profile) => profile.profileOffers)
    profile: ProfileEntity;

    @ManyToOne(() => OfferEntity, (offer) => offer.profileOffers, {
        eager: true,
    })
    offer: OfferEntity;

    dtoClass = ProfileOfferDto;
}
