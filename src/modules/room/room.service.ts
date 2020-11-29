import { Injectable } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { RoomEntity } from '../../entities/room.entity';
import { UserEntity } from '../../entities/user.entity';
import { ProfileRoomRepository } from '../../repositories/profileRoom.repository';
import { RoomRepository } from '../../repositories/room.repository';

@Injectable()
export class RoomService {
    constructor(
        private readonly _roomRepository: RoomRepository,
        private readonly _profileRoomRepository: ProfileRoomRepository,
    ) {}

    async getRooms(
        user: UserEntity,
        options: IPaginationOptions,
    ): Promise<Pagination<RoomEntity>> {
        // TODO: make subquery
        const roomIds = (
            await this._profileRoomRepository.find({
                select: ['roomId'],
                where: { user },
            })
        ).map((room) => room.roomId);

        /*const rooms = this._roomRepository
            .createQueryBuilder('room')
            .select(['room.id', 'room.updatedAt', 'profileRooms', 'profileRooms.id'])
            .leftJoin('room.profileRooms', 'profileRooms')
            .leftJoin('profileRooms.user', 'user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('room.id IN (:...roomIds)', { roomIds })
            .orderBy('room.updatedAt', 'DESC');*/

        return paginate<RoomEntity>(this._roomRepository, options);
    }
}
