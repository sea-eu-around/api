import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { CommentEntity } from '../../../../entities/comment.entity';
import { CommentRepository } from '../../../../repositories/comment.repository';
import { GroupMemberRepository } from '../../../../repositories/group-member.repository';
import { PostRepository } from '../../../../repositories/post.repository';

@Injectable()
export class CommentService {
    constructor(
        private readonly _postRepository: PostRepository,
        private readonly _commentRepository: CommentRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
    ) {}

    async retrieve({
        postId,
        groupId,
        options,
        profileId,
    }: {
        postId: string;
        groupId: string;
        profileId: string;
        options: IPaginationOptions;
    }): Promise<Pagination<CommentEntity>> {
        const member = await this._groupMemberRepository.member({
            groupId,
            profileId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const comments = this._commentRepository
            .createQueryBuilder('comment')
            .where('comment.postId = :postId', { postId })
            .orderBy('groupMember.createdAt', 'DESC');

        return paginate<CommentEntity>(comments, options);
    }
}
