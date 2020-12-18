import {
    Body,
    Controller,
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

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
    constructor(private readonly _notificationService: NotificationService) {}

    @Post('register')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successfully-registered-token',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async registerToken(
        @Body() registerTokenDto: RegisterTokenDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._notificationService.registerToken(
            registerTokenDto.token,
            user,
        );

        return {
            description: 'successfully-registered-token',
        };
    }
}
