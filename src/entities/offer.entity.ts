import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { OffersCategoryType } from '../common/constants/offers-category-type';
import { OfferDto } from '../dto/OfferDto';
import { ProfileOfferEntity } from './profileOffer.entity';

@Entity('offer')
export class OfferEntity extends AbstractCompositeEntity<OfferDto> {
    @Column()
    @PrimaryColumn()
    id: string;

    @Column({ type: 'enum', enum: OffersCategoryType })
    category: OffersCategoryType;

    @Column()
    allowChooseProfile: boolean;

    @Column()
    allowChooseGender: boolean;

    @Column()
    allowInterRole: boolean;

    @OneToMany(() => ProfileOfferEntity, (profileOffer) => profileOffer.offer)
    profileOffers: ProfileOfferEntity[];

    dtoClass = OfferDto;
}
