import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateInterestDto {
    @ApiProperty()
    @IsString()
    readonly key: string;

    constructor(key: string) {
        this.key = key;
    }
}
