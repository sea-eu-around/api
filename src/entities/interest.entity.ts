import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { InterestDto } from '../dto/InterestDto';
import { ProfileEntity } from './profile.entity';

@Entity('interest')
export class InterestEntity extends AbstractCompositeEntity<InterestDto> {
    @PrimaryColumn()
    key: string;

    @ManyToMany(() => ProfileEntity, (profile) => profile.interests)
    profile: ProfileEntity;

    dtoClass = InterestDto;
}
