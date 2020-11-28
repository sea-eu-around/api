import { Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { RoomDto } from '../dto/RoomDto';
import { MatchingEntity } from './matching.entity';
import { MessageEntity } from './message.entity';
import { UserRoomEntity } from './userRoom.entity';

@Entity('room')
export class RoomEntity extends AbstractEntity<RoomDto> {
    @ManyToOne(() => MessageEntity, (message) => message.room)
    messages: MessageEntity[];

    @OneToOne(() => MatchingEntity, (matching) => matching.room)
    matching?: MatchingEntity;

    @OneToMany(() => UserRoomEntity, (userRoom) => userRoom.room)
    userRooms: UserRoomEntity[];

    dtoClass = RoomDto;
}
