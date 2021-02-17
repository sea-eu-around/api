import { Transform } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

import { FeedType } from '../../../../common/constants/feed-type';

export class RetrievePostQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform(parseInt)
    readonly limit!: number;

    @IsEnum(FeedType)
    readonly type!: FeedType;
}
