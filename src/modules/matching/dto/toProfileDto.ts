import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ToProfileDto {
    @ApiProperty()
    @IsString()
    readonly toProfileId: string;
}
