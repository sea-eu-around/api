'use strict';

import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { RoleType } from '../../common/constants/role-type';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserDeleteDto } from './dto/UserDeleteDto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UserController {
    constructor(private _userService: UserService) {}

    @Post('resendVerificationLink')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(RoleType.ADMIN)
    @ApiParam({ type: 'boolean', name: 'send' })
    async resendVerificationLink(
        @AuthUser() user: UserEntity,
        @Param('send') send: boolean,
    ): Promise<PayloadSuccessDto> {
        await this._userService.resendVerificationLink({
            send,
            loggedUser: user,
        });

        return {
            description: 'successfully-resend-verification-link',
        };
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'user-deleted',
        type: DeleteResult,
    })
    async deleteUser(
        @Body() userDeleteDto: UserDeleteDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._userService.softDeleteUser(userDeleteDto, user);

        return {
            description: 'successfully-deleted-user',
        };
    }
}
