import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { GroupRoleType } from '../../common/constants/group-role-type';
import { GroupEntity } from '../../entities/group.entity';
import { UserEntity } from '../../entities/user.entity';
import { GroupRepository } from '../../repositories/group.repository';
import { GroupMemberRepository } from '../../repositories/groupMember.repository';
import { CreateGroupPayloadDto } from './dto/CreateGroupPayloadDto';
import { UpdateGroupPayloadDto } from './dto/UpdateGroupPayloadDto';

@Injectable()
export class GroupService {
    private readonly _logger = new Logger(GroupService.name);

    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
    ) {}

    async getMany(
        profileId: string,
        options: IPaginationOptions,
    ): Promise<Pagination<GroupEntity>> {
        // TODO: make subquery
        const groupIds = (
            await this._groupMemberRepository.find({
                select: ['groupId'],
                where: { profileId },
            })
        ).map((groupMember) => groupMember.groupId);

        const groups = this._groupRepository
            .createQueryBuilder('group')
            .where('group.id IN (:...groupIds)', {
                groupIds: [null, ...groupIds],
            })
            .orderBy('group.updatedAt', 'DESC');

        return paginate<GroupEntity>(groups, options);
    }

    async getOne(id: string, profileId: string): Promise<GroupEntity> {
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
            role: GroupRoleType.ADMIN,
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
        if (!(await this._groupMemberRepository.isMemberAdmin(user.id, id))) {
            throw new UnauthorizedException();
        }

        return this._groupRepository.save({
            id,
            ...updateGroupPayloadDto,
        });
    }
}
