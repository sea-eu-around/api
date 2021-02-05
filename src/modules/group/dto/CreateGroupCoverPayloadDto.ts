import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupCoverPayloadDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly fileName: string;
}
