import { ApiPropertyOptional } from '@nestjs/swagger';

import { PostStatusType } from '../common/constants/post-status-type';
import { PostType } from '../common/constants/post-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { PostEntity } from '../entities/post.entity';
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

    constructor(post: PostEntity) {
        super(post);
        this.id = post.id;
        this.type = post.type;
        this.status = post.status;
        this.text = post.text;
    }
}