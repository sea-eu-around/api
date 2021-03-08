import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { GroupFeedType } from '../../../common/constants/group-feed-type';
import { GroupMemberRoleType } from '../../../common/constants/group-member-role-type';
import { PostStatusType } from '../../../common/constants/post-status-type';
import { PostType } from '../../../common/constants/post-type';
import { VoteEntityType } from '../../../common/constants/voteEntityType';
import { PostEntity } from '../../../entities/post.entity';
import { GroupMemberRepository } from '../../../repositories/group-member.repository';
import { GroupRepository } from '../../../repositories/group.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { SimplePostRepository } from '../../../repositories/simple-post.repository';
import { VoteRepository } from '../../../repositories/vote.repository';
import { CreatePostPayloadDto } from './dto/CreatePostPayloadDto';
import { DeletePostParamDto } from './dto/DeletePostParamDto';
import { UpdatePostParamDto } from './dto/UpdatePostParamDto';
import { UpdatePostPayloadDto } from './dto/UpdatePostPayloadDto';

@Injectable()
export class PostService {
    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _postRepository: PostRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
        private readonly _simplePostRepository: SimplePostRepository,
        private readonly _voteRepository: VoteRepository,
    ) {}
    async retrieve({
        profileId,
        groupId,
        options,
        type,
    }: {
        profileId: string;
        groupId: string;
        options: IPaginationOptions;
        type: GroupFeedType;
    }): Promise<Pagination<PostEntity>> {
        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const postsQb = this._postRepository
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.creator', 'creator')
            .leftJoinAndSelect('creator.avatar', 'avatar')
            .addSelect('(posts.upVotesCount - posts.downVotesCount)', 'score')
            .where('posts.group_id = :groupId', {
                groupId,
            });

        switch (type) {
            case GroupFeedType.NEWEST:
                postsQb.orderBy('posts.createdAt', 'DESC');
                break;
            case GroupFeedType.OLDEST:
                postsQb.orderBy('posts.createdAt', 'ASC');
                break;
            case GroupFeedType.POPULAR:
                postsQb.orderBy('score', 'DESC');
        }

        const posts = await paginate<PostEntity>(postsQb, options);

        for (const post of posts.items) {
            post.isVoted = false;
            const vote = await this._voteRepository.findOne({
                fromProfileId: profileId,
                entityType: VoteEntityType.POST,
                entityId: post.id,
            });
            if (vote) {
                post.isVoted = true;
                post.voteType = vote.voteType;
            }
        }
        return posts;
    }

    async retrieveOne({
        profileId,
        groupId,
        id,
    }: {
        profileId: string;
        groupId: string;
        id: string;
    }): Promise<PostEntity> {
        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const post = await this._postRepository.findOne({ id });
        post.isVoted = false;
        const vote = await this._voteRepository.findOne({
            fromProfileId: profileId,
            entityType: VoteEntityType.POST,
            entityId: id,
        });

        if (vote) {
            post.isVoted = true;
            post.voteType = vote.voteType;
        }

        return post;
    }

    async create({
        profileId,
        groupId,
        payload,
    }: {
        profileId: string;
        groupId: string;
        payload: CreatePostPayloadDto;
    }): Promise<PostEntity> {
        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        let post: PostEntity;

        if (payload.type === PostType.SIMPLE) {
            const prePost = this._simplePostRepository.create({
                groupId,
                creatorId: profileId,
                text: payload.text,
                status:
                    member.role === GroupMemberRoleType.ADMIN
                        ? PostStatusType.APPROVED
                        : PostStatusType.PENDING,
            });

            post = await this._simplePostRepository.save(prePost);
        }

        return post;
    }

    async update({
        profileId,
        params,
        payload,
    }: {
        profileId: string;
        params: UpdatePostParamDto;
        payload: UpdatePostPayloadDto;
    }): Promise<PostEntity> {
        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId: params.groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        let post = await this._postRepository.findOne({
            id: params.id,
        });

        if (!(post.creatorId === profileId)) {
            throw new UnauthorizedException();
        }

        if (payload.type === PostType.SIMPLE) {
            post = await this._simplePostRepository.save({
                ...params,
                ...payload,
            });
        }

        return post;
    }

    async delete({
        profileId,
        params,
    }: {
        profileId: string;
        params: DeletePostParamDto;
    }): Promise<void> {
        const post = await this._postRepository.findOne({
            where: { id: params.id },
        });

        const member = await this._groupMemberRepository.isMember({
            profileId,
            groupId: params.groupId,
        });

        if (
            !(
                member.role === GroupMemberRoleType.ADMIN ||
                post.creatorId === profileId
            )
        ) {
            throw new UnauthorizedException();
        }

        await this._postRepository.delete({ id: params.id });
    }
}
