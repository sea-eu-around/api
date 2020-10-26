import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
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

    @Column()
    target: number;

    @ManyToOne(() => ProfileEntity, (profile) => profile.profileOffers)
    profile: ProfileEntity;

    @ManyToOne(() => OfferEntity, (offer) => offer.profileOffers, {
        eager: true,
    })
    offer: OfferEntity;

    dtoClass = ProfileOfferDto;
}
