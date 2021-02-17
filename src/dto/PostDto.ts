import { ApiPropertyOptional } from '@nestjs/swagger';

import { PostStatusType } from '../common/constants/post-status-type';
import { PostType } from '../common/constants/post-type';
import { VoteType } from '../common/constants/vote-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { PostEntity } from '../entities/post.entity';
import { UtilsService } from '../providers/utils.service';
import { GroupDto } from './GroupDto';
import { ProfileDto } from './ProfileDto';

export class PostDto extends AbstractDto {
    @ApiPropertyOptional()
    id: string;

    @ApiPropertyOptional()
    type: PostType;

    @ApiPropertyOptional()
    status: PostStatusType;

    @ApiPropertyOptional()
    text: string;

    @ApiPropertyOptional()
    creator: ProfileDto;

    @ApiPropertyOptional()
    group: GroupDto;

    @ApiPropertyOptional()
    groupId: string;

    @ApiPropertyOptional()
    isVoted: boolean;

    @ApiPropertyOptional()
    voteType?: VoteType;

    @ApiPropertyOptional()
    upVotesCount: number;

    @ApiPropertyOptional()
    downVotesCount: number;

    constructor(post: PostEntity) {
        super(post);
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
        this.id = post.id;
        this.type = post.type;
        this.status = post.status;
        this.text = post.text;
        this.creator = UtilsService.isDto(post.creator)
            ? post.creator.toDto()
            : null;
        this.groupId = post.groupId;
        this.upVotesCount = post.upVotesCount;
        this.downVotesCount = post.downVotesCount;
        this.isVoted = post.isVoted;
        this.voteType = post.voteType;
    }
}
