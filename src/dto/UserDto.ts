'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { RoleType } from '../common/constants/role-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends AbstractDto {
    @ApiPropertyOptional()
    firstName: string;

    @ApiPropertyOptional()
    lastName: string;

    @ApiPropertyOptional()
    username: string;

    @ApiPropertyOptional({ enum: RoleType })
    role: RoleType;

    @ApiPropertyOptional()
    email: string;

    @ApiPropertyOptional()
    phone: string;

    constructor(user: UserEntity) {
        super(user);
        this.role = user.role;
        this.email = user.email;
        this.phone = user.phone;
    }
}
