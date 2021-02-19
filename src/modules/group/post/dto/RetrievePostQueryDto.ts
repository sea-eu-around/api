import { Transform } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

import { GroupFeedType } from '../../../../common/constants/group-feed-type';

export class RetrievePostQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform(parseInt)
    readonly limit!: number;

    @IsEnum(GroupFeedType)
    readonly type!: GroupFeedType;
}
