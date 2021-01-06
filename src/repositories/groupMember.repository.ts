import { EntityRepository, Repository } from 'typeorm';

import { GroupRoleType } from '../common/constants/group-role-type';
import { GroupMemberEntity } from '../entities/groupMember.entity';

@EntityRepository(GroupMemberEntity)
export class GroupMemberRepository extends Repository<GroupMemberEntity> {
    async isMemberAdmin(profileId: string, groupId: string): Promise<boolean> {
        return (
            (await this.findOne({
                profileId,
                groupId,
                role: GroupRoleType.ADMIN,
            })) !== null
        );
    }
}
