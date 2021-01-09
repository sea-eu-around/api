import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { GroupMemberRoleType } from '../../../common/constants/group-member-role-type';
import { PostStatusType } from '../../../common/constants/post-status-type';
import { PostEntity } from '../../../entities/post.entity';
import { GroupRepository } from '../../../repositories/group.repository';
import { GroupMemberRepository } from '../../../repositories/groupMember.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { CreateGroupPostPayloadDto } from '../dto/CreateGroupPostPayloadDto';

@Injectable()
export class PostService {
    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _postRepository: PostRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
    ) {}
    async create({
        profileId,
        groupId,
        createGroupPostPayloadDto,
    }: {
        profileId: string;
        groupId: string;
        createGroupPostPayloadDto: CreateGroupPostPayloadDto;
    }): Promise<PostEntity> {
        const group = await this._groupRepository.findOne(groupId);

        if (!group) {
            throw new NotFoundException();
        }

        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const post = this._postRepository.create({
            groupId,
            creatorId: profileId,
            ...createGroupPostPayloadDto,
            status:
                member.role === GroupMemberRoleType.ADMIN
                    ? PostStatusType.APPROVED
                    : PostStatusType.PENDING,
        });

        return this._postRepository.save(post);
    }
}
