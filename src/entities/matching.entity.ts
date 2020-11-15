import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MatchingStatusType } from '../common/constants/matching-status-type';
import { MatchingDto } from '../dto/MatchingDto';
import { UserEntity } from './user.entity';

@Entity('matching')
export class MatchingEntity extends AbstractEntity<MatchingDto> {
    @ManyToOne(() => UserEntity, (user) => user.givenLikes)
    fromUser: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.receivedLikes)
    toUser: UserEntity;

    @Column()
    fromUserId: string;

    @Column()
    toUserId: string;

    @Column({
        type: 'enum',
        enum: MatchingStatusType,
        default: MatchingStatusType.REQUEST,
    })
    status: MatchingStatusType;

    dtoClass = MatchingDto;
}
