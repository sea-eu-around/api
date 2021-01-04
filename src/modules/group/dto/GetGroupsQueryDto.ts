import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetGroupsQueryDto {
    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;
}
