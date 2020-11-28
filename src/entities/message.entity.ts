import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MessageDto } from '../dto/MessageDto';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity('message')
export class MessageEntity extends AbstractEntity<MessageDto> {
    @Column()
    text: string;

    @ManyToOne(() => RoomEntity, (room) => room.messages)
    room: RoomEntity;

    @ManyToOne(() => UserEntity, (user) => user.messages)
    sender: UserEntity;

    @Column()
    sent: boolean;

    dtoClass = MessageDto;
}
