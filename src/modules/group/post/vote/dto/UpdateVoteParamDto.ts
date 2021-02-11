import { IsUUID } from 'class-validator';

import { Exists } from '../../../../../decorators/exists-validator.decorator';
import { GroupEntity } from '../../../../../entities/group.entity';
import { VoteEntity } from '../../../../../entities/vote.entity';

export class UpdateVoteParamDto {
    @IsUUID()
    @Exists<GroupEntity>(GroupEntity, 'id')
    readonly groupId!: string;

    @IsUUID()
    @Exists<VoteEntity>(VoteEntity, 'id')
    readonly id!: string;
}
