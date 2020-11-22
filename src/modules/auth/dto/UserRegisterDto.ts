'use strict';

import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    Matches,
} from 'class-validator';

import { LanguageType } from '../../../common/constants/language-type';
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
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
        { message: 'validation.password.notStrongEnough' },
    )
    @ApiProperty({ minLength: 8 })
    readonly password: string;

    @ApiProperty()
    @IsEnum(LanguageType)
    locale: LanguageType;
}
