import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class RetrieveCommentsQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform((value) =>
        parseInt(value, 10) > 100 ? 100 : parseInt(value, 10),
    )
    readonly limit!: number;
}
