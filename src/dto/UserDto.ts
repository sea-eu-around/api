'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { LanguageType } from '../common/constants/language-type';
import { RoleType } from '../common/constants/role-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { UserEntity } from '../entities/user.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';

export class UserDto extends AbstractDto {
    @ApiPropertyOptional({ enum: RoleType })
    role: RoleType;

    @ApiPropertyOptional()
    email: string;

    @ApiPropertyOptional()
    isVerified: boolean;

    @ApiPropertyOptional()
    onboarded: boolean;

    @ApiPropertyOptional()
    profile: ProfileDto;

    @ApiPropertyOptional()
    locale?: LanguageType;

    verificationToken?: string;

    constructor(user: UserEntity) {
        super(user);
        this.role = user.role || RoleType.USER;
        this.email = user.email;
        this.isVerified = user.isVerified;
        this.onboarded = user.onboarded;
        this.locale = user.locale;
        this.verificationToken = user.verificationToken;
        this.profile = UtilsService.isDto(user.profile)
            ? user.profile.toDto({ noDate: true })
            : user.profile;
    }
}
