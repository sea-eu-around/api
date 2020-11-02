import { Column, Entity, ManyToMany } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { InterestDto } from '../dto/InterestDto';
import { ProfileEntity } from './profile.entity';

@Entity('interest')
export class InterestEntity extends AbstractEntity<InterestDto> {
    @Column()
    key: string;

    @ManyToMany(() => ProfileEntity, (profile) => profile.interests)
    profile: ProfileEntity;

    dtoClass = InterestDto;
}
