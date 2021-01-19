'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserLoginDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    @Transform((email) => email.toLowerCase())
    readonly email: string;

    @IsString()
    @ApiProperty()
    readonly password: string;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional()
    recover: boolean;
}
