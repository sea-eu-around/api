import { EntityRepository, Repository } from 'typeorm';

import { RoomEntity } from '../entities/room.entity';

@EntityRepository(RoomEntity)
export class RoomRepository extends Repository<RoomEntity> {}
