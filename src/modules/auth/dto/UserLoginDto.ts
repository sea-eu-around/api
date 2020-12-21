'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    @Transform((email) => email.toLowerCase())
    readonly email: string;

    @IsString()
    @ApiProperty()
    readonly password: string;
}
