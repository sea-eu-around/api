import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDeleteDto {
    @ApiProperty()
    @IsString()
    readonly password: string;
}
