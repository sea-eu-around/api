'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { IsSEAEmail } from '../../../decorators/validators.decorator';

export class UserRegisterDto {
    @IsString()
    @IsEmail(
        {},
        {
            message: 'Incorrect email format.',
        },
    )
    @IsSEAEmail({
        message: 'Incorrect SEA email.',
    })
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string;

    @IsString()
    @MinLength(8, {
        message: 'Password is too short.',
    })
    @ApiProperty({ minLength: 8 })
    readonly password: string;
}
