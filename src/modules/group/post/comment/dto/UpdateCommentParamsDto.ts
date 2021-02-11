import { IsUUID } from 'class-validator';

import { Exists } from '../../../../../decorators/exists-validator.decorator';
import { CommentEntity } from '../../../../../entities/comment.entity';
import { GroupEntity } from '../../../../../entities/group.entity';
import { PostEntity } from '../../../../../entities/post.entity';

export class UpdateCommentParamsDto {
    @IsUUID()
    @Exists<GroupEntity>(GroupEntity, 'id')
    groupId: string;

    @IsUUID()
    @Exists<PostEntity>(PostEntity, 'id')
    postId: string;

    @IsUUID()
    @Exists<CommentEntity>(CommentEntity, 'id')
    id: string;
}
