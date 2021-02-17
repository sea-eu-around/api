import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Between } from 'typeorm';

import { FeedType } from '../../common/constants/feed-type';
import { GroupMemberRoleType } from '../../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../../common/constants/group-member-status-type';
import { GroupEntity } from '../../entities/group.entity';
import { PostEntity } from '../../entities/post.entity';
import { UserEntity } from '../../entities/user.entity';
import { GroupCoverRepository } from '../../repositories/group-cover.repository';
import { GroupMemberRepository } from '../../repositories/group-member.repository';
import { GroupRepository } from '../../repositories/group.repository';
import { PostRepository } from '../../repositories/post.repository';
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
    ) {}

    async retrieve({
        options,
        user,
        profileId,
    }: {
        options: IPaginationOptions;
        user: UserEntity;
        profileId?: string;
    }): Promise<Pagination<GroupEntity>> {
        const groups = this._groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.cover', 'cover');

        if (profileId) {
            const groupIds = (
                await this._groupMemberRepository.find({
                    select: ['groupId'],
                    where: { profileId },
                })
            ).map((groupMember) => groupMember.groupId);

            groups
                .andWhere('group.id IN (:...groupIds)', { groupIds })
                .orderBy('group.updatedAt', 'DESC');

            if (profileId !== user.id) {
                groups.andWhere('group.visible = :visible', { visible: true });
            }

            return paginate<GroupEntity>(groups, options);
        }

        groups
            .andWhere('group.visible = :visible', { visible: true })
            .orderBy('group.updatedAt', 'DESC');

        return paginate<GroupEntity>(groups, options);
    }

    async retrieveOne(id: string, _profileId: string): Promise<GroupEntity> {
        return this._groupRepository.findOne(id);
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
            !(await this._groupMemberRepository.admin({
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
            !(await this._groupMemberRepository.admin({
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
            !(await this._groupMemberRepository.admin({
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
        type,
    }: {
        options: IPaginationOptions;
        user: UserEntity;
        type: FeedType;
    }): Promise<Pagination<PostEntity>> {
        const usersGroupsIds = (
            await this._groupMemberRepository.find({
                profileId: user.id,
            })
        ).map((groupMember) => groupMember.groupId);

        const postsQb = this._postRepository
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.creator', 'creator')
            .leftJoinAndSelect('creator.avatar', 'avatar')
            .leftJoinAndSelect('posts.group', 'group')
            .addSelect('(posts.upVotesCount - posts.downVotesCount)', 'score')
            .where('posts.group_id IN (:...groupIds)', {
                groupIds: [null, ...usersGroupsIds],
            });

        switch (type) {
            case FeedType.CHRONOLOGICAL:
                postsQb.orderBy('posts.createdAt', 'DESC');
                break;
            case FeedType.TRENDING:
                postsQb.orderBy('score', 'DESC');
        }

        return paginate<PostEntity>(postsQb, options);
    }
}
