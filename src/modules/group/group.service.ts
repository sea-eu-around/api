import { Injectable, Logger } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { GroupEntity } from '../../entities/group.entity';
import { GroupRepository } from '../../repositories/group.repository';
import { GroupMemberRepository } from '../../repositories/groupMember.repository';

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

    createOrUpdate(): void {
        throw new Error('Method not implemented.');
    }
}
