import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserVerificationQueryDto {
    @ApiProperty()
    @IsNotEmpty()
    token: string;
}
