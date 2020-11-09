import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MatchingStatusType } from '../common/constants/matching-status-type';
import { MatchingDto } from '../dto/MatchingDto';
import { ProfileEntity } from './profile.entity';

@Entity('matching')
export class MatchingEntity extends AbstractEntity<MatchingDto> {
    @ManyToOne(() => ProfileEntity, (profile) => profile.givenLikes)
    fromProfile: ProfileEntity;

    @ManyToOne(() => ProfileEntity, (profile) => profile.receivedLikes)
    toProfile: ProfileEntity;

    @Column({
        type: 'enum',
        enum: MatchingStatusType,
        default: MatchingStatusType.REQUEST,
    })
    status: MatchingStatusType;

    dtoClass = MatchingDto;
}
