import { EntityRepository, Repository } from 'typeorm';

import { GroupMemberRoleType } from '../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../common/constants/group-member-status-type';
import { GroupMemberEntity } from '../entities/groupMember.entity';

@EntityRepository(GroupMemberEntity)
export class GroupMemberRepository extends Repository<GroupMemberEntity> {
    async admin({
        profileId,
        groupId,
    }: {
        profileId: string;
        groupId: string;
    }): Promise<GroupMemberEntity> {
        return this.findOne({
            profileId,
            groupId,
            role: GroupMemberRoleType.ADMIN,
        });
    }

    async member({
        profileId,
        groupId,
    }: {
        profileId: string;
        groupId: string;
    }): Promise<GroupMemberEntity> {
        return this.findOne({
            profileId,
            groupId,
            status: GroupMemberStatusType.APPROVED,
        });
    }
}
