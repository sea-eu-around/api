import { Injectable } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { RoomEntity } from '../../entities/room.entity';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';

@Injectable()
export class RoomService {
    constructor(
        private readonly _roomRepository: RoomRepository,
        private readonly _profileRoomRepository: ProfileRoomRepository,
    ) {}

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
                'profiles',
                'profile.firstName',
                'profile.lastName',
                'profile.avatar',
            ])
            .leftJoin('room.profiles', 'profiles')
            .leftJoin('profiles.profile', 'profile')
            .where('room.id IN (:...roomIds)', { roomIds })
            .orderBy('room.updatedAt', 'DESC');

        return paginate<RoomEntity>(rooms, options);
    }
}
