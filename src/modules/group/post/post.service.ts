import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
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

@Injectable()
export class PostService {
    constructor(
        private readonly _groupRepository: GroupRepository,
        private readonly _postRepository: PostRepository,
        private readonly _groupMemberRepository: GroupMemberRepository,
        private readonly _simplePostRepository: SimplePostRepository,
    ) {}
    async retrieve(
        profileId: string,
        groupId: string,
        options: IPaginationOptions,
    ): Promise<Pagination<PostEntity>> {
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

        const query = this._postRepository
            .createQueryBuilder('post')
            .where('post.groupId = :groupId', { groupId })
            .orderBy('post.created_at', 'DESC');

        return paginate<PostEntity>(query, options);
    }

    async create(
        profileId: string,
        groupId: string,
        createPostPayloadDto: CreatePostPayloadDto,
    ): Promise<PostEntity> {
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

        let post: PostEntity;

        if (createPostPayloadDto.type === PostType.SIMPLE) {
            const prePost = this._simplePostRepository.create({
                groupId,
                creatorId: profileId,
                text: createPostPayloadDto.text,
                status:
                    member.role === GroupMemberRoleType.ADMIN
                        ? PostStatusType.APPROVED
                        : PostStatusType.PENDING,
            });

            post = await this._simplePostRepository.save(prePost);
        }

        return post;
    }
}
