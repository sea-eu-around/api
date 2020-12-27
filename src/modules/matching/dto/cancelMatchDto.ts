import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CancelMatchDto {
    @ApiProperty()
    @IsString()
    matchingEntityId: string;
}
