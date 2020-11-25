import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class UserVerificationQueryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsJWT()
    token: string;
}
