import { IsString, IsUUID } from 'class-validator';

import { Exists } from '../../../../decorators/exists-validator.decorator';
import { GroupEntity } from '../../../../entities/group.entity';
import { PostEntity } from '../../../../entities/post.entity';

export class RetrievePostIdParamDto {
    @IsUUID()
    @Exists<GroupEntity>(GroupEntity, 'id')
    readonly groupId!: string;

    @IsString()
    @Exists<PostEntity>(PostEntity, 'id')
    readonly id: string;
}
