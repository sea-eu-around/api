import { ApiPropertyOptional } from '@nestjs/swagger';

import { PostStatusType } from '../common/constants/post-status-type';
import { PostType } from '../common/constants/post-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { GroupEntity } from '../entities/group.entity';
import { PostEntity } from '../entities/post.entity';
import { ProfileEntity } from '../entities/profile.entity';

export class PostDto extends AbstractDto {
    @ApiPropertyOptional()
    id: string;

    @ApiPropertyOptional()
    type?: PostType;

    @ApiPropertyOptional()
    status: PostStatusType;

    @ApiPropertyOptional()
    text: string;

    @ApiPropertyOptional()
    creator: ProfileEntity;

    @ApiPropertyOptional()
    inGroup: GroupEntity;

    constructor(post: PostEntity) {
        super(post);
        this.id = post.id;
        this.type = post.type;
        this.status = post.status;
        this.text = post.text;
        this.creator = post.creator;
        this.inGroup = post.inGroup;
    }
}
