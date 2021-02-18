import { Injectable, UnauthorizedException } from '@nestjs/common';

import { VoteType } from '../../../../common/constants/vote-type';
import { VoteEntityType } from '../../../../common/constants/voteEntityType';
import { VoteEntity } from '../../../../entities/vote.entity';
import { GroupMemberRepository } from '../../../../repositories/group-member.repository';
import { VoteRepository } from '../../../../repositories/vote.repository';

@Injectable()
export class VoteService {
    constructor(
        private readonly _voteRepository: VoteRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
    ) {}

    async retrieve({
        profileId,
        groupId,
        entityType,
        entityId,
    }: {
        profileId: string;
        groupId: string;
        entityType: VoteEntityType;
        entityId: string;
    }): Promise<VoteEntity[]> {
        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        return this._voteRepository.find({ entityType, entityId });
    }

    async create({
        profileId,
        groupId,
        entityType,
        entityId,
        voteType,
    }: {
        profileId: string;
        groupId: string;
        entityType: VoteEntityType;
        entityId: string;
        voteType: VoteType;
    }): Promise<VoteEntity> {
        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const alreadyVoted = await this._voteRepository.findOne({
            entityType,
            entityId,
            fromProfileId: profileId,
        });

        if (alreadyVoted) {
            throw new UnauthorizedException('Already exist');
        }

        const vote = this._voteRepository.create({
            voteType,
            entityId,
            entityType,
            fromProfileId: profileId,
        });

        return this._voteRepository.save(vote);
    }

    async update({
        profileId,
        groupId,
        entityType,
        entityId,
        voteType,
    }: {
        profileId: string;
        groupId: string;
        entityType: VoteEntityType;
        entityId: string;
        voteType: VoteType;
    }): Promise<VoteEntity> {
        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const vote = await this._voteRepository.findOne({
            entityType,
            entityId,
            fromProfileId: profileId,
        });

        if (!(vote.fromProfileId === profileId)) {
            throw new UnauthorizedException();
        }

        vote.voteType = voteType;

        return this._voteRepository.save(vote);
    }

    async delete({
        profileId,
        groupId,
        entityType,
        entityId,
    }: {
        profileId: string;
        groupId: string;
        entityType: VoteEntityType;
        entityId: string;
    }): Promise<VoteEntity> {
        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const vote = await this._voteRepository.findOne({
            entityType,
            entityId,
            fromProfileId: profileId,
        });

        if (!(vote.fromProfileId === profileId)) {
            throw new UnauthorizedException();
        }

        return this._voteRepository.remove(vote);
    }
}
