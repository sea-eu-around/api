import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { UserRoomDto } from '../dto/UserRoomDto';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity('user_room')
export class UserRoomEntity extends AbstractCompositeEntity<UserRoomDto> {
    @Index()
    @Column()
    @PrimaryColumn()
    userId!: string;

    @Index()
    @Column()
    @PrimaryColumn()
    roomId!: string;

    @ManyToOne(() => UserEntity, (user) => user.userRooms)
    user: UserEntity;

    @ManyToOne(() => RoomEntity, (room) => room.userRooms)
    room: RoomEntity;

    @Column()
    lastMessageSeenId?: string;

    dtoClass = UserRoomDto;
}
