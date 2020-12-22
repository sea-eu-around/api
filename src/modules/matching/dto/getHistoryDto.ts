import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { MatchingStatusType } from '../../../common/constants/matching-status-type';

export class GetHistoryDto {
    @IsArray()
    @IsEnum(MatchingStatusType, { each: true })
    @Transform((value: string) => value.split(','))
    status: string[];

    @IsOptional()
    @IsString()
    search?: string;

    @IsInt()
    @Transform(parseInt)
    limit: number;

    @IsInt()
    @Transform(parseInt)
    page: number;
}
