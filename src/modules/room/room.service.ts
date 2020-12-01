import { ForbiddenException, Injectable } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { RoomType } from '../../common/constants/room-type';
import { MessageEntity } from '../../entities/message.entity';
import { RoomEntity } from '../../entities/room.entity';
import { MessageRepository } from '../../repositories/message.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';

@Injectable()
export class RoomService {
    constructor(
        private readonly _roomRepository: RoomRepository,
        private readonly _profileRoomRepository: ProfileRoomRepository,
        private readonly _messageRepository: MessageRepository,
    ) {}

    async getRooms(
        profileId: string,
        options: IPaginationOptions,
        type?: RoomType,
    ): Promise<Pagination<RoomEntity>> {
        // TODO: make subquery
        const roomIds = (
            await this._profileRoomRepository.find({
                select: ['roomId'],
                where: { profileId },
            })
        ).map((room) => room.roomId);

        const rooms = this._roomRepository
            .createQueryBuilder('room')
            .select([
                'room.id',
                'room.updatedAt',
                'lastMessage',
                'profiles',
                'profile.id',
                'profile.firstName',
                'profile.lastName',
                'profile.avatar',
            ])
            .leftJoin('room.lastMessage', 'lastMessage')
            .leftJoin('room.profiles', 'profiles')
            .leftJoin('profiles.profile', 'profile')
            .where('room.id IN (:...roomIds)', { roomIds: [null, ...roomIds] })
            .orderBy('room.updatedAt', 'DESC');

        return paginate<RoomEntity>(rooms, options);
    }

    async getRoom(roomId: string, profileId: string): Promise<RoomEntity> {
        const isProfileInRoom = await this._profileRoomRepository.isProfileInRoom(
            profileId,
            roomId,
        );
        if (!isProfileInRoom) {
            throw new ForbiddenException();
        }

        return this._roomRepository
            .createQueryBuilder('room')
            .select([
                'room.id',
                'room.updatedAt',
                'lastMessage',
                'profiles',
                'profile.id',
                'profile.firstName',
                'profile.lastName',
                'profile.avatar',
            ])
            .leftJoin('room.lastMessage', 'lastMessage')
            .leftJoin('room.profiles', 'profiles')
            .leftJoin('profiles.profile', 'profile')
            .where('room.id = :roomId', { roomId })
            .getOne();
    }

    async getRoomsMessages(
        profileId: string,
        roomId: string,
        options: IPaginationOptions,
    ): Promise<Pagination<MessageEntity>> {
        if (
            !(await this._profileRoomRepository.isProfileInRoom(
                profileId,
                roomId,
            ))
        ) {
            throw new ForbiddenException();
        }

        return paginate<MessageEntity>(this._messageRepository, options, {
            where: { roomId },
            order: { updatedAt: 'DESC' },
        });
    }
}
