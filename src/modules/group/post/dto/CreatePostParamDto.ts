import { IsUUID } from 'class-validator';

import { Exists } from '../../../../decorators/exists-validator.decorator';
import { GroupEntity } from '../../../../entities/group.entity';

export class CreatePostParamDto {
    @IsUUID()
    @Exists<GroupEntity>(GroupEntity, 'id')
    readonly groupId!: string;
}
