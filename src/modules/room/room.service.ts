import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { MessageEntity } from '../../entities/message.entity';
import { RoomEntity } from '../../entities/room.entity';
import { MessageRepository } from '../../repositories/message.repository';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';

@Injectable()
export class RoomService {
    private _logger: Logger;

    constructor(
        private readonly _roomRepository: RoomRepository,
        private readonly _profileRoomRepository: ProfileRoomRepository,
        private readonly _messageRepository: MessageRepository,
    ) {
        this._logger = new Logger('RoomService');
    }

    async getRooms(
        profileId: string,
        options: IPaginationOptions,
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
            .leftJoinAndSelect('profile.avatar', 'avatar')
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
            .leftJoinAndSelect('profile.avatar', 'avatar')
            .where('room.id = :roomId', { roomId })
            .getOne();
    }

    async getRoomsMessages(
        profileId: string,
        roomId: string,
        options: IPaginationOptions,
        beforeDate?: string,
    ): Promise<Pagination<MessageEntity>> {
        if (
            !(await this._profileRoomRepository.isProfileInRoom(
                profileId,
                roomId,
            ))
        ) {
            throw new ForbiddenException();
        }

        let messages = this._messageRepository
            .createQueryBuilder('messages')
            .where('messages.roomId = :roomId', { roomId })
            .orderBy('messages.updatedAt', 'DESC')
            .take(10);

        if (beforeDate) {
            messages = messages.andWhere('messages.updatedAt < :beforeDate', {
                beforeDate,
            });
        }

        return paginate<MessageEntity>(messages, options);
    }
}
