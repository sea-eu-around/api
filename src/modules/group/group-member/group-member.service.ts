import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Brackets } from 'typeorm';

import { GroupMemberStatusType } from '../../../common/constants/group-member-status-type';
import { LanguageType } from '../../../common/constants/language-type';
import { GroupMemberEntity } from '../../../entities/groupMember.entity';
import { UserEntity } from '../../../entities/user.entity';
import { GroupMemberRepository } from '../../../repositories/group-member.repository';
import { GroupRepository } from '../../../repositories/group.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { UserRepository } from '../../user/user.repository';
import { UpdateGroupMemberPayloadDto } from './dto/UpdateGroupMemberPayloadDto';

@Injectable()
export class GroupMemberService {
    private _expo: Expo = new Expo();

    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
        private readonly _userRepository: UserRepository,
        private readonly _postRepository: PostRepository,
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

            groupMembers
                .andWhere('groupMember.profileId != :profileId', {
                    profileId: user.id,
                })
                .andWhere(
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
        if (
            await this._groupMemberRepository.findOne({
                groupId,
                profileId: profileId ? profileId : user.id,
            })
        ) {
            throw new ConflictException();
        }

        const preGroupMember = this._groupMemberRepository.create();
        preGroupMember.groupId = groupId;
        preGroupMember.profileId = profileId ? profileId : user.id;

        const isAdmin = await this._groupMemberRepository.isAdmin({
            groupId,
            profileId: user.id,
        });

        const group = await this._groupRepository.findOne({ id: groupId });

        if (profileId) {
            preGroupMember.status = isAdmin
                ? GroupMemberStatusType.INVITED_BY_ADMIN
                : GroupMemberStatusType.INVITED;

            const invitedUser = await this._userRepository.findOne(profileId);

            const notification: ExpoPushMessage = {
                to: invitedUser.expoPushToken || invitedUser.email,
                sound: 'default',
                title:
                    invitedUser.locale === LanguageType.FR
                        ? 'Nouvelle invitation !'
                        : 'New invitation!',
                body:
                    invitedUser.locale === LanguageType.FR
                        ? `Rejoignez le groupe "${group.name}".`
                        : `Join the group "${group.name}".`,
                data: {
                    groupId: group.id,
                },
            };

            await this._expo.sendPushNotificationsAsync([notification]);
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

        let membership: GroupMemberEntity;

        if (
            existingMembership &&
            existingMembership.status === GroupMemberStatusType.INVITED
        ) {
            membership = await this._groupMemberRepository.save({
                profileId,
                groupId,
                status: GroupMemberStatusType.PENDING,
            });
        }

        if (
            existingMembership &&
            existingMembership.status === GroupMemberStatusType.INVITED_BY_ADMIN
        ) {
            membership = await this._groupMemberRepository.save({
                profileId,
                groupId,
                status: GroupMemberStatusType.APPROVED,
            });
        }

        if (isAdmin) {
            membership = await this._groupMemberRepository.save({
                profileId,
                groupId,
                ...updateGroupMemberPayloadDto,
            });
        }

        if (
            membership.status === GroupMemberStatusType.APPROVED &&
            existingMembership.status === GroupMemberStatusType.PENDING
        ) {
            const invitedUser = await this._userRepository.findOne(profileId);
            const group = await this._groupRepository.findOne({ id: groupId });

            const notification: ExpoPushMessage = {
                to: invitedUser.expoPushToken || invitedUser.email,
                sound: 'default',
                title:
                    invitedUser.locale === LanguageType.FR
                        ? 'Bienvenue dans le groupe !'
                        : 'Welcome to the group!',
                body:
                    invitedUser.locale === LanguageType.FR
                        ? `Votre demande pour rejoindre "${group.name}" a été acceptée, venez-vite découvrir ce qu'il s'y passe.`
                        : `Your demand to join "${group.name}" has been approved, come now and find out what's going on there.`,
                data: {
                    groupId: group.id,
                },
            };

            await this._expo.sendPushNotificationsAsync([notification]);
        }

        if (!membership) {
            throw new UnauthorizedException();
        }

        return membership;
    }

    async deleteGroupMember({
        groupId,
        user,
        cascade,
        profileId,
    }: {
        groupId: string;
        user: UserEntity;
        cascade: boolean;
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

        if (cascade) {
            await this._postRepository.delete({
                groupId,
                creatorId: profileId || user.id,
            });
        }
    }
}
