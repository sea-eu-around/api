'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { RoleType } from '../common/constants/role-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends AbstractDto {
    @ApiPropertyOptional({ enum: RoleType })
    role: RoleType;

    @ApiPropertyOptional()
    email: string;

    active: boolean;

    onboarded: boolean;

    verificationToken: string;

    constructor(user: UserEntity) {
        super(user);
        this.role = user.role || RoleType.USER;
        this.email = user.email;
        this.active = user.active;
        this.onboarded = user.onboarded;
        this.verificationToken = user.verificationToken;
    }
}
