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

    async isProfileInRoom(profileId: string, roomId: string): Promise<boolean> {
        return (await this.find({ profileId, roomId })).length > 0;
    }

    async getRoomProfileIds(roomId: string): Promise<string[]> {
        return (
            await this.find({
                where: { roomId },
                select: ['profileId'],
            })
        ).map((profileRoom) => profileRoom.profileId);
    }
}
