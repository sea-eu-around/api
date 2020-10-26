import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { OffersCategoryType } from '../common/constants/offers-category-type';
import { OfferDto } from '../dto/OfferDto';

@Entity('offer')
export class OfferEntity extends AbstractEntity<OfferDto> {
    @Column()
    key: string;

    @Column({ type: 'integer' })
    target: number;

    @Column({ type: 'enum', enum: OffersCategoryType })
    category: OffersCategoryType;

    @Column()
    allowInterRole: boolean;

    dtoClass = OfferDto;
}
