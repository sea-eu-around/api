import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Between } from 'typeorm';

import { GroupMemberRoleType } from '../../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../../common/constants/group-member-status-type';
import { GroupEntity } from '../../entities/group.entity';
import { UserEntity } from '../../entities/user.entity';
import { GroupMemberRepository } from '../../repositories/group-member.repository';
import { GroupRepository } from '../../repositories/group.repository';
import { ConfigService } from '../../shared/services/config.service';
import { CreateGroupPayloadDto } from './dto/CreateGroupPayloadDto';
import { UpdateGroupPayloadDto } from './dto/UpdateGroupPayloadDto';

@Injectable()
export class GroupService {
    private readonly _logger = new Logger(GroupService.name);

    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
        private readonly _configService: ConfigService,
    ) {}

    async retrieve(
        options: IPaginationOptions,
    ): Promise<Pagination<GroupEntity>> {
        // TODO: make subquery
        /*const groupIds = (
            await this._groupMemberRepository.find({
                select: ['groupId'],
                where: { profileId },
            })
        ).map((groupMember) => groupMember.groupId);*/

        const groups = this._groupRepository
            .createQueryBuilder('group')
            /*.where('group.id IN (:...groupIds)', {
                groupIds: [null, ...groupIds],
            })*/
            .orderBy('group.updatedAt', 'DESC');

        return paginate<GroupEntity>(groups, options);
    }

    async retrieveOne(id: string, _profileId: string): Promise<GroupEntity> {
        /*const isProfileInRoom = await this._groupMemberRepository.isProfileInRoom(
            profileId,
            roomId,
        );

        if (!isProfileInRoom) {
            throw new ForbiddenException();
        }*/

        return this._groupRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id })
            .getOne();
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

        return this._groupRepository.save({
            id,
            ...updateGroupPayloadDto,
        });
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
}
