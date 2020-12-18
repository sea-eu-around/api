import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterTokenDto {
    @ApiProperty()
    @IsString()
    token: string;
}
