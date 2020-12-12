import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { InterestDto } from '../dto/InterestDto';
import { ProfileEntity } from './profile.entity';

@Entity('interest')
export class InterestEntity extends AbstractCompositeEntity<InterestDto> {
    @PrimaryColumn()
    id: string;

    @ManyToMany(() => ProfileEntity, (profile) => profile.interests, {
        onDelete: 'CASCADE',
    })
    profile: ProfileEntity;

    dtoClass = InterestDto;
}
