import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { RoomDto } from '../dto/RoomDto';
import { MatchingEntity } from './matching.entity';
import { MessageEntity } from './message.entity';
import { ProfileRoomEntity } from './profileRoom.entity';

@Entity('room')
export class RoomEntity extends AbstractEntity<RoomDto> {
    @OneToMany(() => MessageEntity, (message) => message.room, {
        onDelete: 'CASCADE',
    })
    messages: MessageEntity[];

    @OneToOne(() => MessageEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    lastMessage: MessageEntity;

    @OneToOne(() => MatchingEntity, (matching) => matching.room, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    matching: MatchingEntity;

    matchingId: string;

    @OneToMany(() => ProfileRoomEntity, (profileRoom) => profileRoom.room, {
        cascade: true,
    })
    profiles: ProfileRoomEntity[];

    dtoClass = RoomDto;
}
