import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentPayloadDto {
    @ApiProperty()
    @IsString()
    readonly text: string;
}
