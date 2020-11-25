'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @ApiProperty()
    @IsJWT()
    jwtToken: string;

    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
        { message: 'validation.password.notStrongEnough' },
    )
    @ApiProperty({ minLength: 8 })
    readonly password: string;
}
