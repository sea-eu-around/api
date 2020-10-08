import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { InterestDto } from '../dto/InterestDto';

@Entity('interest')
export class InterestEntity extends AbstractEntity<InterestDto> {
    @Column()
    name: string;

    dtoClass = InterestDto;
}
