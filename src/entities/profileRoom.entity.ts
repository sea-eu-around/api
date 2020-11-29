import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { ProfileRoomDto } from '../dto/ProfileRoomDto';
import { ProfileEntity } from './profile.entity';
import { RoomEntity } from './room.entity';

@Entity('profile_room')
export class ProfileRoomEntity extends AbstractCompositeEntity<ProfileRoomDto> {
    @Index()
    @Column()
    @PrimaryColumn()
    profileId!: string;

    @Index()
    @Column()
    @PrimaryColumn()
    roomId!: string;

    @ManyToOne(() => ProfileEntity, (profile) => profile.rooms)
    profile: ProfileEntity;

    @ManyToOne(() => RoomEntity, (room) => room.profiles)
    room: RoomEntity;

    @Column({ nullable: true })
    lastMessageSeenId?: string;

    dtoClass = ProfileRoomDto;
}
