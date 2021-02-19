import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import {
    GroupMemberInvitationStatusType,
    GroupMemberStatusType,
} from '../../../common/constants/group-member-status-type';
import { GroupMemberEntity } from '../../../entities/groupMember.entity';
import { UserEntity } from '../../../entities/user.entity';
import { GroupRepository } from '../../../repositories/group.repository';
import { GroupMemberRepository } from '../../../repositories/groupMember.repository';
import { UpdateGroupMemberPayloadDto } from './dto/UpdateGroupMemberPayloadDto';

@Injectable()
export class GroupMemberService {
    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
    ) {}

    async retrieveMembers(
        groupId: string,
        options: IPaginationOptions,
        user: UserEntity,
        statuses?: GroupMemberStatusType[],
    ): Promise<Pagination<GroupMemberEntity>> {
        let groupMembers = this._groupMemberRepository
            .createQueryBuilder('groupMember')
            .leftJoinAndSelect('groupMember.profile', 'profile')
            .leftJoinAndSelect('profile.avatar', 'avatar')
            .where('groupMember.groupId = :groupId', { groupId })
            .andWhere('groupMember.profileId != :profileId', {
                profileId: user.id,
            })
            .orderBy('groupMember.createdAt', 'DESC');

        if (statuses) {
            groupMembers = groupMembers.andWhere(
                'groupMember.status IN (:...statuses)',
                {
                    statuses: [null, ...statuses],
                },
            );
        }

        return paginate<GroupMemberEntity>(groupMembers, options);
    }

    async createGroupMember(
        groupId: string,
        profileId: string,
        status?: GroupMemberInvitationStatusType,
    ): Promise<GroupMemberEntity> {
        const group = await this._groupRepository.findOne({ id: groupId });

        if (!group) {
            throw new NotFoundException();
        }

        const preGroupMember = this._groupMemberRepository.create();
        preGroupMember.groupId = groupId;
        preGroupMember.profileId = profileId;
        preGroupMember.status = status
            ? <GroupMemberStatusType>(<unknown>status)
            : group.requiresApproval
            ? GroupMemberStatusType.PENDING
            : GroupMemberStatusType.APPROVED;

        return this._groupMemberRepository.save(preGroupMember);
    }

    async updateGroupMember({
        groupId,
        profileId,
        updateGroupMemberPayloadDto,
        user,
    }: {
        groupId: string;
        profileId: string;
        updateGroupMemberPayloadDto: UpdateGroupMemberPayloadDto;
        user: UserEntity;
    }): Promise<GroupMemberEntity> {
        const existingMembership = await this._groupMemberRepository.findOne({
            groupId,
            profileId,
        });

        const isAdmin = await this._groupMemberRepository.isAdmin({
            groupId,
            profileId: user.id,
        });

        if (
            existingMembership &&
            existingMembership.status === GroupMemberStatusType.INVITED
        ) {
            return this._groupMemberRepository.save({
                profileId,
                groupId,
                status: GroupMemberStatusType.PENDING,
            });
        }

        if (
            existingMembership &&
            existingMembership.status === GroupMemberStatusType.INVITED_BY_ADMIN
        ) {
            return this._groupMemberRepository.save({
                profileId,
                groupId,
                status: GroupMemberStatusType.APPROVED,
            });
        }

        if (isAdmin) {
            return this._groupMemberRepository.save({
                profileId,
                groupId,
                ...updateGroupMemberPayloadDto,
            });
        }

        throw new UnauthorizedException();
    }

    async deleteGroupMember({
        groupId,
        user,
        profileId,
    }: {
        groupId: string;
        user: UserEntity;
        profileId?: string;
    }): Promise<void> {
        if (
            profileId &&
            profileId !== user.id &&
            !(await this._groupMemberRepository.isAdmin({
                groupId,
                profileId: user.id,
            }))
        ) {
            throw new UnauthorizedException();
        }

        await this._groupMemberRepository.delete({
            groupId,
            profileId: profileId || user.id,
        });
    }
}
