import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class RetrieveGroupsQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform(parseInt)
    readonly limit!: number;

    @IsString()
    @IsOptional()
    readonly profileId?: string;

    @IsOptional()
    @IsString()
    readonly search?: string;
}
