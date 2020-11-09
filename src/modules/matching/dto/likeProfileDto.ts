import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikeProfileDto {
    @ApiProperty()
    @IsString()
    readonly toProfileId: string;
}
