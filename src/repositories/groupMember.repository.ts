import { EntityRepository, Repository } from 'typeorm';

import { GroupMemberRoleType } from '../common/constants/group-member-role-type';
import { GroupMemberEntity } from '../entities/groupMember.entity';

@EntityRepository(GroupMemberEntity)
export class GroupMemberRepository extends Repository<GroupMemberEntity> {
    async isAdmin(profileId: string, groupId: string): Promise<boolean> {
        const groupMember = await this.findOne({
            profileId,
            groupId,
            role: GroupMemberRoleType.ADMIN,
        });

        if (groupMember) {
            return true;
        }

        return false;
    }
}
