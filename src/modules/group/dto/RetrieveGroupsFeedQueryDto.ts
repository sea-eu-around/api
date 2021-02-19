import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class RetrieveGroupsFeedQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform(parseInt)
    readonly limit!: number;
}
