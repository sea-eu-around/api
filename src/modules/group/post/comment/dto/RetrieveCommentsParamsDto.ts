import { IsUUID } from 'class-validator';

import { Exists } from '../../../../../decorators/exists-validator.decorator';
import { GroupEntity } from '../../../../../entities/group.entity';
import { PostEntity } from '../../../../../entities/post.entity';

export class RetrieveCommentsParamsDto {
    @IsUUID()
    @Exists<GroupEntity>(GroupEntity, 'id')
    groupId: string;

    @IsUUID()
    @Exists<PostEntity>(PostEntity, 'id')
    postId: string;
}
