import { ApiPropertyOptional } from '@nestjs/swagger';

import { VoteType } from '../common/constants/vote-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { CommentEntity } from '../entities/comment.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';

export class CommentDto extends AbstractDto {
    @ApiPropertyOptional()
    readonly text!: string;

    @ApiPropertyOptional()
    readonly creator!: ProfileDto;

    @ApiPropertyOptional()
    readonly children: CommentDto[];

    @ApiPropertyOptional()
    readonly isVoted: boolean;

    @ApiPropertyOptional()
    readonly voteType?: VoteType;

    @ApiPropertyOptional()
    readonly upVotesCount: number;

    @ApiPropertyOptional()
    readonly downVotesCount: number;

    constructor(comment: CommentEntity) {
        super(comment);
        this.text = comment.text;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
        this.upVotesCount = comment.upVotesCount;
        this.downVotesCount = comment.downVotesCount;
        this.creator = UtilsService.isDto(comment.creator)
            ? comment.creator.toDto()
            : null;
        this.children = UtilsService.isDtos(comment.children)
            ? comment.children.toDtos()
            : null;
        this.isVoted = comment.isVoted;
        this.voteType = comment.voteType;
    }
}
