import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class GetRoomsMessagesQueryDto {
    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;

    @IsOptional()
    @IsDateString()
    beforeDate: string;
}
