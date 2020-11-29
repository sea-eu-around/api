import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { RoomType } from '../../../common/constants/room-type';

export class GetRoomsQueryDto {
    @IsOptional()
    @IsEnum(RoomType)
    type?: RoomType;

    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;
}
