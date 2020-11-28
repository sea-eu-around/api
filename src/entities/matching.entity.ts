import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MatchingStatusType } from '../common/constants/matching-status-type';
import { MatchingDto } from '../dto/MatchingDto';
import { RoomEntity } from './room.entity';
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

    @OneToOne(() => RoomEntity, (room) => room.matching)
    @JoinColumn()
    room?: RoomEntity;

    dtoClass = MatchingDto;
}
