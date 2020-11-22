'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

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
    verificationToken: string;

    @ApiPropertyOptional()
    profile: ProfileDto;

    constructor(user: UserEntity) {
        super(user);
        this.role = user.role || RoleType.USER;
        this.email = user.email;
        this.active = user.active;
        this.onboarded = user.onboarded;
        this.verificationToken = user.verificationToken;
        this.profile = UtilsService.isDto(user.profile)
            ? user.profile.toDto({ noDate: true })
            : user.profile;
    }
}
