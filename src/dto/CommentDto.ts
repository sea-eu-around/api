import { ApiPropertyOptional } from '@nestjs/swagger';

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

    constructor(comment: CommentEntity) {
        super(comment);
        this.text = comment.text;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
        this.creator = UtilsService.isDto(comment.creator)
            ? comment.creator.toDto()
            : null;
        this.children = UtilsService.isDtos(comment.children)
            ? comment.children.toDtos()
            : null;
    }
}
