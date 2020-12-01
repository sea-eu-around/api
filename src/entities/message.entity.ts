import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { MessageDto } from '../dto/MessageDto';
import { ProfileEntity } from './profile.entity';
import { RoomEntity } from './room.entity';

@Entity('message')
export class MessageEntity extends AbstractEntity<MessageDto> {
    @Column()
    text: string;

    @ManyToOne(() => RoomEntity, (room) => room.messages)
    room: RoomEntity;

    @Column()
    roomId: string;

    @ManyToOne(() => ProfileEntity, (profile) => profile.messages)
    sender: ProfileEntity;

    @Column()
    senderId: string;

    @Column({ default: true })
    sent: boolean;

    dtoClass = MessageDto;
}
