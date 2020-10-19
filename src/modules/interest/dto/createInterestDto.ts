import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateInterestDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}
