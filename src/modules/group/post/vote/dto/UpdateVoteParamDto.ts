import { IsEnum, IsUUID } from 'class-validator';

import { VoteEntityType } from '../../../../../common/constants/voteEntityType';
import { Exists } from '../../../../../decorators/exists-validator.decorator';
import { GroupEntity } from '../../../../../entities/group.entity';
import { VoteEntity } from '../../../../../entities/vote.entity';

export class UpdateVoteParamDto {
    @IsUUID()
    @Exists<GroupEntity>(GroupEntity, 'id')
    readonly groupId!: string;

    @IsEnum(VoteEntityType)
    readonly entityType!: VoteEntityType;

    @IsUUID()
    @Exists<VoteEntity>(VoteEntity, 'id')
    readonly entityId!: string;
}
