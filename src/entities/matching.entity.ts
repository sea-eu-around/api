import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MatchingStatusType } from '../common/constants/matching-status-type';
import { MatchingDto } from '../dto/MatchingDto';
import { ProfileEntity } from './profile.entity';
import { RoomEntity } from './room.entity';

@Entity('matching')
export class MatchingEntity extends AbstractEntity<MatchingDto> {
    @ManyToOne(() => ProfileEntity, (profile) => profile.givenLikes)
    fromProfile: ProfileEntity;

    @ManyToOne(() => ProfileEntity, (profile) => profile.receivedLikes)
    toProfile: ProfileEntity;

    @Column()
    fromProfileId: string;

    @Column()
    toProfileId: string;

    @Column({
        type: 'enum',
        enum: MatchingStatusType,
        default: MatchingStatusType.REQUEST,
    })
    status: MatchingStatusType;

    @OneToOne(() => RoomEntity, (room) => room.matching, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    room?: RoomEntity;

    @Column({ nullable: true })
    roomId?: string;

    dtoClass = MatchingDto;
}
