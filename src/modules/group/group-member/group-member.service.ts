import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Brackets } from 'typeorm';

import { GroupMemberStatusType } from '../../../common/constants/group-member-status-type';
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

    async retrieveMembers({
        groupId,
        options,
        user,
        statuses,
        search,
    }: {
        groupId: string;
        options: IPaginationOptions;
        user: UserEntity;
        statuses?: GroupMemberStatusType[];
        search?: string;
    }): Promise<Pagination<GroupMemberEntity>> {
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

        if (search && search.length > 0) {
            const words = search.split(' ');
            groupMembers.andWhere(
                new Brackets((qb) => {
                    for (const word of words) {
                        qb.andWhere('profile.firstName ilike :search', {
                            search: `%${word}%`,
                        });
                        qb.orWhere('profile.lastName ilike :search', {
                            search: `%${word}%`,
                        });
                    }
                }),
            );
        }

        return paginate<GroupMemberEntity>(groupMembers, options);
    }

    async createGroupMember({
        groupId,
        user,
        profileId,
    }: {
        groupId: string;
        user: UserEntity;
        profileId?: string;
    }): Promise<GroupMemberEntity> {
        const preGroupMember = this._groupMemberRepository.create();
        preGroupMember.groupId = groupId;
        preGroupMember.profileId = profileId ? profileId : user.id;

        const isAdmin = await this._groupMemberRepository.isAdmin({
            groupId,
            profileId,
        });

        const group = await this._groupRepository.findOne({ id: groupId });

        if (profileId) {
            preGroupMember.status = isAdmin
                ? GroupMemberStatusType.INVITED_BY_ADMIN
                : GroupMemberStatusType.INVITED;
        } else {
            preGroupMember.status = group.requiresApproval
                ? GroupMemberStatusType.PENDING
                : GroupMemberStatusType.APPROVED;
        }

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
