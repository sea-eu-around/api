import { Injectable } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { In } from 'typeorm';

import { RoomEntity } from '../../entities/room.entity';
import { UserEntity } from '../../entities/user.entity';
import { RoomRepository } from '../../repositories/room.repository';
import { UserRoomRepository } from '../../repositories/userRoom.repository';

@Injectable()
export class RoomService {
    constructor(
        private readonly _roomRepository: RoomRepository,
        private readonly _userRoomRepository: UserRoomRepository,
    ) {}

    async getRooms(
        user: UserEntity,
        options: IPaginationOptions,
    ): Promise<Pagination<RoomEntity>> {
        const roomIds = await this._userRoomRepository.find({
            select: ['roomId'],
            where: { user },
        });

        return paginate<RoomEntity>(this._roomRepository, options, {
            where: { id: In(roomIds.map((room) => room.roomId)) },
            order: { updatedAt: 'DESC' },
            relations: ['userRooms'],
        });
    }
}
