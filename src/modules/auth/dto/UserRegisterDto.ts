'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsSEAEmail } from '../../../decorators/validators.decorator';

export class UserRegisterDto {
    @IsString()
    @IsEmail({}, { message: 'email.invalid' })
    @IsSEAEmail({
        message: 'validation.email.invalidDomain',
    })
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string;

    @IsString()
    /*@Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
        { message: 'validation.password.notStrongEnough' },
    )*/
    @ApiProperty({ minLength: 8 })
    readonly password: string;
}
