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
import { CreateCommentPayloadDto } from './dto/CreateCommentPayloadDto';

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

        const rootsCommentsQb = this._commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('comments.creator', 'creator')
            .leftJoinAndSelect('creator.avatar', 'avatar')
            .where('comments.parentId IS NULL');

        const rootsCommentsPaginate = await paginate<CommentEntity>(
            rootsCommentsQb,
            options,
        );

        for (const rootsComment of rootsCommentsPaginate.items) {
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
        const member = await this._groupMemberRepository.member({
            groupId,
            profileId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        return this._commentRepository.findOne({ where: { id, postId } });
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
        const member = await this._groupMemberRepository.member({
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
}
