import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { GroupMemberRoleType } from '../../../../common/constants/group-member-role-type';
import { VoteEntityType } from '../../../../common/constants/voteEntityType';
import { CommentEntity } from '../../../../entities/comment.entity';
import { CommentRepository } from '../../../../repositories/comment.repository';
import { GroupMemberRepository } from '../../../../repositories/group-member.repository';
import { PostRepository } from '../../../../repositories/post.repository';
import { VoteRepository } from '../../../../repositories/vote.repository';
import { CreateCommentPayloadDto } from './dto/CreateCommentPayloadDto';
import { UpdateCommentPayloadDto } from './dto/UpdateCommentPayloadDto';

@Injectable()
export class CommentService {
    constructor(
        private readonly _postRepository: PostRepository,
        private readonly _commentRepository: CommentRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
        private readonly _voteRepository: VoteRepository,
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
        const member = await this._groupMemberRepository.isMember({
            groupId,
            profileId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const rootsCommentsQb = this._commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('comments.creator', 'creator')
            .leftJoinAndSelect('creator.avatar', 'avatar')
            .where('comments.parentId IS NULL')
            .andWhere('comments.postId = :postId', { postId });

        const rootsCommentsPaginate = await paginate<CommentEntity>(
            rootsCommentsQb,
            options,
        );
        for (const rootsComment of rootsCommentsPaginate.items) {
            rootsComment.isVoted = false;
            const entitiesAndScalars = await this._commentRepository
                .createDescendantsQueryBuilder(
                    'treeEntity',
                    'treeClosure',
                    rootsComment,
                )
                .leftJoinAndSelect('treeEntity.creator', 'creator')
                .leftJoinAndSelect('creator.avatar', 'avatar')
                .getRawAndEntities();

            const relationMaps = this._commentRepository.createRelationMaps(
                'treeEntity',
                entitiesAndScalars.raw,
            );

            const vote = await this._voteRepository.findOne({
                fromProfileId: profileId,
                entityType: VoteEntityType.COMMENT,
                entityId: rootsComment.id,
            });

            if (vote) {
                rootsComment.isVoted = true;
                rootsComment.voteType = vote.voteType;
            }

            this._commentRepository.buildChildrenEntityTree(
                rootsComment,
                entitiesAndScalars.entities,
                relationMaps,
            );
        }

        return rootsCommentsPaginate;
    }

    async retrieveOne({
        id,
        postId,
        groupId,
        profileId,
    }: {
        id: string;
        postId: string;
        groupId: string;
        profileId: string;
    }): Promise<CommentEntity> {
        const member = await this._groupMemberRepository.isMember({
            groupId,
            profileId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const comment = await this._commentRepository.findOne({
            where: { id, postId },
        });

        const vote = await this._voteRepository.findOne({
            fromProfileId: profileId,
            entityType: VoteEntityType.COMMENT,
            entityId: id,
        });

        if (vote) {
            comment.isVoted = true;
            comment.voteType = vote.voteType;
        }

        return comment;
    }

    async create({
        profileId,
        groupId,
        postId,
        payload,
    }: {
        profileId: string;
        groupId: string;
        postId: string;
        payload: CreateCommentPayloadDto;
    }): Promise<CommentEntity> {
        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const preComment = this._commentRepository.create({
            postId,
            creatorId: profileId,
            text: payload.text,
        });

        if (payload.parentId) {
            const parent = await this._commentRepository.findOne(
                payload.parentId,
            );
            preComment.parent = parent;
        }

        return this._commentRepository.save(preComment);
    }

    async update({
        id,
        profileId,
        payload,
    }: {
        id: string;
        profileId: string;
        payload: UpdateCommentPayloadDto;
    }): Promise<CommentEntity> {
        const comment = await this._commentRepository.findOne(id);

        if (!(comment.creatorId === profileId)) {
            throw new UnauthorizedException();
        }

        const preComment = this._commentRepository.create({
            id,
            text: payload.text,
        });

        return this._commentRepository.save(preComment);
    }

    async delete({
        id,
        profileId,
        groupId,
    }: {
        id: string;
        profileId: string;
        groupId: string;
    }): Promise<void> {
        const comment = await this._commentRepository.findOne(id);

        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId,
        });

        if (
            !(
                member.role === GroupMemberRoleType.ADMIN ||
                comment.creatorId === profileId
            )
        ) {
            throw new UnauthorizedException();
        }

        await this._commentRepository.delete({ id });
    }
}
