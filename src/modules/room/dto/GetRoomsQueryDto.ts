import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetRoomsQueryDto {
    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;
}
