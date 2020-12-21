'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    @Transform((email) => email.toLowerCase())
    email: string;
}
