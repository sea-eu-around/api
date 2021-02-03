import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';

import { GroupMemberRoleType } from '../../../common/constants/group-member-role-type';
import { PostStatusType } from '../../../common/constants/post-status-type';
import { PostType } from '../../../common/constants/post-type';
import { PostEntity } from '../../../entities/post.entity';
import { GroupRepository } from '../../../repositories/group.repository';
import { GroupMemberRepository } from '../../../repositories/groupMember.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { SimplePostRepository } from '../../../repositories/simple-post.repository';
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
    ) {}
    async retrieve({
        profileId,
        groupId,
        options,
    }: {
        profileId: string;
        groupId: string;
        options: IPaginationOptions;
    }): Promise<Pagination<PostEntity>> {
        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        const query = this._postRepository
            .createQueryBuilder('post')
            .where('post.groupId = :groupId', { groupId })
            .orderBy('post.created_at', 'DESC');

        return paginate<PostEntity>(query, options);
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
        const member = await this._groupMemberRepository.member({
            profileId,
            groupId,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        return this._postRepository.findOne({ id });
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
        const member = await this._groupMemberRepository.member({
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
        const member = await this._groupMemberRepository.member({
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
            id: params.id,
        });

        const member = await this._groupMemberRepository.member({
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
