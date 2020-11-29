import { EntityRepository, Repository } from 'typeorm';

import { ProfileRoomEntity } from '../entities/profileRoom.entity';

@EntityRepository(ProfileRoomEntity)
export class ProfileRoomRepository extends Repository<ProfileRoomEntity> {
    createForProfileIds(profileIds: string[]): ProfileRoomEntity[] {
        return profileIds.map((profileId) => {
            const profileRoom = this.create();
            profileRoom.profileId = profileId;
            return profileRoom;
        });
    }
}