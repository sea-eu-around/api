import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Between, Brackets, In } from 'typeorm';

import { GroupMemberRoleType } from '../../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../../common/constants/group-member-status-type';
import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { VoteEntityType } from '../../common/constants/voteEntityType';
import { GroupEntity } from '../../entities/group.entity';
import { PostEntity } from '../../entities/post.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { GroupCoverRepository } from '../../repositories/group-cover.repository';
import { GroupMemberRepository } from '../../repositories/group-member.repository';
import { GroupRepository } from '../../repositories/group.repository';
import { MatchingRepository } from '../../repositories/matching.repository';
import { PostRepository } from '../../repositories/post.repository';
import { VoteRepository } from '../../repositories/vote.repository';
import { ConfigService } from '../../shared/services/config.service';
import { CreateGroupCoverPayloadDto } from './dto/CreateGroupCoverPayloadDto';
import { CreateGroupPayloadDto } from './dto/CreateGroupPayloadDto';
import { UpdateGroupPayloadDto } from './dto/UpdateGroupPayloadDto';

@Injectable()
export class GroupService {
    private readonly _logger = new Logger(GroupService.name);

    constructor(
        private readonly _mailerService: MailerService,
        private readonly _groupRepository: GroupRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
        private readonly _configService: ConfigService,
        private readonly _groupCoverRepository: GroupCoverRepository,
        private readonly _postRepository: PostRepository,
        private readonly _voteRepository: VoteRepository,
        private readonly _matchingRepository: MatchingRepository,
    ) {}

    async retrieve({
        options,
        user,
        search,
        statuses,
        explore,
    }: {
        options: IPaginationOptions;
        user: UserEntity;
        search?: string;
        statuses?: GroupMemberStatusType[];
        explore?: boolean;
    }): Promise<Pagination<GroupEntity>> {
        const groupsQb = this._groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.cover', 'cover')
            .leftJoinAndSelect(
                'group.members',
                'members',
                'members.profileId = :profileId',
                { profileId: user.id },
            )
            .orderBy('group.updatedAt', 'DESC');

        if (!statuses && !explore) {
            groupsQb.andWhere('group.visible = :visible', { visible: true });
        } else {
            if (statuses) {
                const statusesGroupIds = (
                    await this._groupMemberRepository.find({
                        select: ['groupId'],
                        where: { profileId: user.id, status: In(statuses) },
                    })
                ).map((groupMember) => groupMember.groupId);

                groupsQb.orWhere('group.id IN (:...statusesGroupIds)', {
                    statusesGroupIds: [null, ...statusesGroupIds],
                });
            }

            if (explore) {
                const exploreGroupIds = (
                    await this._groupMemberRepository.find({
                        select: ['groupId'],
                        where: {
                            profileId: user.id,
                        },
                    })
                ).map((groupMember) => groupMember.groupId);

                groupsQb.orWhere(
                    new Brackets((qb) => {
                        if (exploreGroupIds) {
                            qb.andWhere(
                                'group.id NOT IN (:...exploreGroupIds)',
                                {
                                    exploreGroupIds,
                                },
                            );
                        }
                        qb.andWhere('group.visible = :visible', {
                            visible: true,
                        });
                    }),
                );
            }
        }

        if (search && search.length > 0) {
            const words = search.split(' ');
            groupsQb.andWhere(
                new Brackets((qb) => {
                    for (const word of words) {
                        qb.andWhere('group.name ILIKE :search', {
                            search: `%${word}%`,
                        });
                    }
                }),
            );
        }

        const groups = await paginate<GroupEntity>(groupsQb, options);

        groups.items.map((group) => {
            if (group.members.length > 0) {
                group.isMember = true;
                group.role = group.members[0].role;
                group.status = group.members[0].status;
                group.members = null;
            }
        });

        return groups;
    }

    async retrieveOne(id: string, profileId: string): Promise<GroupEntity> {
        const group = await this._groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.cover', 'cover')
            .leftJoinAndSelect(
                'group.members',
                'members',
                'members.profileId = :profileId',
                { profileId },
            )
            .where('group.id = :id', { id })
            .getOne();

        if (group.members.length > 0) {
            group.isMember = true;
            group.role = group.members[0].role;
            group.status = group.members[0].status;
            group.members = null;
        }

        return group;
    }

    async create(
        createGroupPayloadDto: CreateGroupPayloadDto,
        user: UserEntity,
    ): Promise<GroupEntity> {
        const preMember = this._groupMemberRepository.create({
            profileId: user.id,
            role: GroupMemberRoleType.ADMIN,
            status: GroupMemberStatusType.APPROVED,
        });

        const preGroup = this._groupRepository.create({
            ...createGroupPayloadDto,
            creatorId: user.id,
            members: [preMember],
        });

        return this._groupRepository.save(preGroup);
    }

    async update(
        id: string,
        updateGroupPayloadDto: UpdateGroupPayloadDto,
        user: UserEntity,
    ): Promise<GroupEntity> {
        if (
            !(await this._groupMemberRepository.isAdmin({
                profileId: user.id,
                groupId: id,
            }))
        ) {
            throw new UnauthorizedException();
        }

        await this._groupRepository.save({
            id,
            ...updateGroupPayloadDto,
        });

        return this._groupRepository.findOne(id);
    }

    async delete(id: string, user: UserEntity): Promise<void> {
        if (
            !(await this._groupMemberRepository.isAdmin({
                profileId: user.id,
                groupId: id,
            }))
        ) {
            throw new UnauthorizedException();
        }

        const group = await this._groupRepository.findOne(id, {
            relations: ['members'],
        });

        await this._groupRepository.softRemove(group);

        /*const offset =
            parseInt(
                this._configService.get('USER_DELETION_MONTHS_OFFSET'),
                10,
            ) || 6;
        deletedAt.setMonth(deletedAt.getMonth() + offset);*/

        // TODO: send a mail with teh date of the group deletion
        /*const mailTemplate =
            user.locale === LanguageType.FR
                ? 'deleteGroup-fr'
                : 'deleteGroup-en';

        const time = new Date();

        await this._mailerService.sendMail({
            to: user.email, // list of receivers
            from: 'sea-eu.around@univ-brest.fr', // sender address
            subject:
                user.locale === LanguageType.FR
                    ? 'Groupe Supprimé'
                    : 'Successfuly deleted group', // Subject line
            template: mailTemplate,
            context: {
                time,
            },
        });*/
    }

    @Cron('0 0 0 * * *')
    async groupDeletionCron(): Promise<void> {
        const from = new Date();
        const offset =
            parseInt(
                this._configService.get('USER_DELETION_MONTHS_OFFSET'),
                10,
            ) || 6;
        from.setMonth(from.getMonth() - offset);

        const to = new Date(from.getTime());
        to.setHours(to.getHours() + 24);

        const groupsToDelete = await this._groupRepository.find({
            where: { deletedAt: Between(from, to) },
            withDeleted: true,
        });

        const promesses: Promise<any>[] = [];

        for (const group of groupsToDelete) {
            promesses.push(this._groupRepository.delete({ id: group.id }));
            // TODO: send mail
        }

        await Promise.all(promesses);

        this._logger.warn(
            {
                message: `Successfully deleted groups between ${from.toString()} and ${to.toString()}.`,
                affectedRows: groupsToDelete.length,
                timestamp: new Date(),
            },
            'GroupsDeletionCron',
        );
    }

    async updateCover({
        createGroupCoverPayloadDto,
        id,
        user,
    }: {
        createGroupCoverPayloadDto: CreateGroupCoverPayloadDto;
        id?: string;
        user?: UserEntity;
    }): Promise<GroupEntity> {
        if (
            !(await this._groupMemberRepository.isAdmin({
                groupId: id,
                profileId: user.id,
            }))
        ) {
            throw new UnauthorizedException();
        }

        const preGroupCover = this._groupCoverRepository.create({
            groupId: id,
            creatorId: { id: user.id },
            path: createGroupCoverPayloadDto.fileName,
            id: createGroupCoverPayloadDto.fileName.split('.')[0],
        });

        const groupCover = await this._groupCoverRepository.save(preGroupCover);

        const group = await this._groupRepository.findOne(id);

        group.cover = groupCover;

        return this._groupRepository.save(group);
    }

    async retrieveFeed({
        options,
        user,
    }: {
        options: IPaginationOptions;
        user: UserEntity;
    }): Promise<Pagination<PostEntity>> {
        const usersGroupsIds = (
            await this._groupMemberRepository.find({
                profileId: user.id,
                status: GroupMemberStatusType.APPROVED,
            })
        ).map((groupMember) => groupMember.groupId);

        const postsQb = this._postRepository
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.creator', 'creator')
            .leftJoinAndSelect('creator.avatar', 'avatar')
            .leftJoinAndSelect('posts.group', 'group')
            .leftJoinAndSelect('group.cover', 'cover')
            .leftJoinAndSelect(
                'group.members',
                'members',
                'members.profileId = :profileId',
                { profileId: user.id },
            )
            .addSelect('(posts.upVotesCount - posts.downVotesCount)', 'score')
            .where('posts.group_id IN (:...groupIds)', {
                groupIds: [null, ...usersGroupsIds],
            })
            .orderBy('posts.createdAt', 'DESC');
        const posts = await paginate<PostEntity>(postsQb, options);

        for (const post of posts.items) {
            post.isVoted = false;
            const vote = await this._voteRepository.findOne({
                fromProfileId: user.id,
                entityType: VoteEntityType.POST,
                entityId: post.id,
            });
            if (vote) {
                post.isVoted = true;
                post.voteType = vote.voteType;
            }

            if (post.group.members.length > 0) {
                post.group.isMember = true;
                post.group.role = post.group.members[0].role;
                post.group.status = post.group.members[0].status;
                post.group.members = null;
            }
        }

        return posts;
    }

    async retrieveAvailableMatches({
        profileId,
        groupId,
        search,
    }: {
        profileId: string;
        groupId: string;
        search?: string;
    }): Promise<ProfileEntity[]> {
        const matchesQb = this._matchingRepository
            .createQueryBuilder('matching')
            .leftJoinAndSelect('matching.fromProfile', 'fromProfile')
            .leftJoinAndSelect('matching.toProfile', 'toProfile')
            .leftJoinAndSelect('toProfile.avatar', 'avatar')
            .where('matching.status = :status', {
                status: MatchingStatusType.MATCH,
            })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('matching.fromProfileId = :id', {
                        id: profileId,
                    }).orWhere('matching.toProfileId = :id', { id: profileId });
                }),
            )
            .orderBy('matching.updated_at', 'DESC');

        if (search && search.length > 0) {
            const words = search.split(' ');
            matchesQb.andWhere(
                new Brackets((qb) => {
                    for (const word of words) {
                        qb.andWhere('fromProfile.firstName ILIKE :search', {
                            search: `%${word}%`,
                        })
                            .orWhere('fromProfile.lastName ILIKE :search', {
                                search: `%${word}%`,
                            })
                            .orWhere('toProfile.firstName ILIKE :search', {
                                search: `%${word}%`,
                            })
                            .orWhere('toProfile.lastName ILIKE :search', {
                                search: `%${word}%`,
                            });
                    }
                }),
            );
        }

        const matches = await matchesQb.getMany();
        const profiles: ProfileEntity[] = [];

        for (const match of matches) {
            if (match.fromProfileId !== profileId) {
                const isIn = await this._groupMemberRepository.findOne({
                    groupId,
                    profileId: match.fromProfileId,
                });
                if (!isIn) {
                    profiles.push(match.fromProfile);
                }
            } else {
                const isIn = await this._groupMemberRepository.findOne({
                    groupId,
                    profileId: match.toProfileId,
                });
                if (!isIn) {
                    profiles.push(match.toProfile);
                }
            }
        }

        return profiles;
    }
}
