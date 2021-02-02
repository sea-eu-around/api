'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

import { LanguageType } from '../../../common/constants/language-type';
import { IsSEAEmail } from '../../../decorators/validators.decorator';

export class UserRegisterDto {
    @IsString()
    @IsEmail({}, { message: 'email.invalid' })
    @IsSEAEmail({
        message: 'Email is not a valid SEA-EU email',
    })
    @IsNotEmpty()
    @ApiProperty()
    @Transform((email) => email.toLowerCase())
    readonly email: string;

    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&^\\/-_+=()[\]|"'~<>:;§.])$/,
        {
            message: 'Password is not strong enough',
        },
    )
    @MinLength(8)
    @ApiProperty({ minLength: 8 })
    readonly password: string;

    @ApiProperty()
    @IsEnum(LanguageType)
    locale: LanguageType;
}
