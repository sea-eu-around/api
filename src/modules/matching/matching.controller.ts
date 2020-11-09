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
import { MatchingDto } from '../../dto/MatchingDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { ToProfileDto } from './dto/toProfileDto';
import { MatchingService } from './matching.service';

@Controller('matching')
@ApiTags('matching')
export class MatchingController {
    constructor(private _matchingService: MatchingService) {}

    @Post('like')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiResponse({ type: MatchingDto, description: 'like' })
    async like(
        @Body() toProfileDto: ToProfileDto,
        @AuthUser() fromUser: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const match = await this._matchingService.like(
            fromUser,
            toProfileDto.toProfileId,
        );

        return {
            description: 'profile-liked',
            data: match,
        };
    }

    @Post('decline')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiResponse({ type: MatchingDto, description: 'decline' })
    async decline(
        @Body() toProfileDto: ToProfileDto,
        @AuthUser() fromUser: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const match = await this._matchingService.decline(
            fromUser,
            toProfileDto.toProfileId,
        );

        return {
            description: 'profile-declined',
            data: match,
        };
    }

    @Post('block')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiResponse({ type: MatchingDto, description: 'block' })
    async block(
        @Body() toProfileDto: ToProfileDto,
        @AuthUser() fromUser: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const match = await this._matchingService.block(
            fromUser,
            toProfileDto.toProfileId,
        );

        return {
            description: 'profile-blocked',
            data: match,
        };
    }
}
