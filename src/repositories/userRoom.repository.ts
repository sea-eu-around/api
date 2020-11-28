import { EntityRepository, Repository } from 'typeorm';

import { UserRoomEntity } from '../entities/userRoom.entity';

@EntityRepository(UserRoomEntity)
export class UserRoomRepository extends Repository<UserRoomEntity> {}
