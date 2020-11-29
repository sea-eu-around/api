import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';
import { UserRoomEntity } from '../entities/userRoom.entity';

@EntityRepository(UserRoomEntity)
export class UserRoomRepository extends Repository<UserRoomEntity> {
    createForUsers(users: UserEntity[]): UserRoomEntity[] {
        return users.map((user) => {
            const userRoom = this.create();
            userRoom.user = user;
            return userRoom;
        });
    }
}
