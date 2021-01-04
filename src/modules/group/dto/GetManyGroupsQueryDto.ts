import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetManyGroupsQueryDto {
    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;
}
