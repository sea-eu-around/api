import { Column, Entity, Index, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MatchingStatusType } from '../common/constants/matching-status-type';
import { MatchingDto } from '../dto/MatchingDto';
import { PolymorphicChildren } from '../polymorphic/decorators';
import { ProfileEntity } from './profile.entity';
import { ReportEntity } from './report.entity';
import { RoomEntity } from './room.entity';

@Entity('matching')
export class MatchingEntity extends AbstractEntity<MatchingDto> {
    @ManyToOne(() => ProfileEntity, (profile) => profile.givenLikes, {
        onDelete: 'CASCADE',
    })
    fromProfile: ProfileEntity;

    @ManyToOne(() => ProfileEntity, (profile) => profile.receivedLikes, {
        onDelete: 'CASCADE',
    })
    toProfile: ProfileEntity;

    @Column()
    @Index()
    fromProfileId: string;

    @Column()
    @Index()
    toProfileId: string;

    @Column({
        type: 'enum',
        enum: MatchingStatusType,
        default: MatchingStatusType.REQUEST,
    })
    status: MatchingStatusType;

    @OneToOne(() => RoomEntity, (room) => room.matching, {
        onDelete: 'CASCADE',
        eager: true,
        cascade: true,
    })
    room?: RoomEntity;

    roomId: string;

    @PolymorphicChildren(() => ReportEntity, {
        eager: false,
    })
    receivedReports: ReportEntity[];

    dtoClass = MatchingDto;
}
