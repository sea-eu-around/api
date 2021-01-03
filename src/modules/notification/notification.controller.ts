import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { RegisterTokenDto } from './dto/RegisterTokenDto';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiTags('Notification')
export class NotificationController {
    constructor(private readonly _notificationService: NotificationService) {}

    @Post('token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successfully-registered-token',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    async addToken(
        @Body() registerTokenDto: RegisterTokenDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._notificationService.addToken(registerTokenDto.token, user);

        return {
            description: 'successfully-registered-token',
        };
    }

    @Delete('token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successfully-deleted-token',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    async removeToken(
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._notificationService.removeToken(user);

        return {
            description: 'successfully-removed-token',
        };
    }
}
