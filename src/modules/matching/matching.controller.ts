import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MatchingStatusType } from '../../common/constants/matching-status-type';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { MatchingDto } from '../../dto/MatchingDto';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { GetHistoryDto } from './dto/getHistoryDto';
import { ToProfileDto } from './dto/toProfileDto';
import { MatchingService } from './matching.service';

@Controller('matching')
@ApiTags('matching')
export class MatchingController {
    constructor(private _matchingService: MatchingService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiResponse({ type: ProfileEntity, description: 'my-matches' })
    async get(@AuthUser() user: UserEntity): Promise<PayloadSuccessDto> {
        const profiles = await this._matchingService.getMyMatches(user.id);

        return {
            description: 'my matches',
            data: profiles,
        };
    }

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
            fromUser.id,
            toProfileDto.toProfileId,
        );

        return {
            description: 'user-liked',
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
            fromUser.id,
            toProfileDto.toProfileId,
        );

        return {
            description: 'user-declined',
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
            fromUser.id,
            toProfileDto.toProfileId,
        );

        return {
            description: 'user-blocked',
            data: match,
        };
    }

    @Get('history')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'status',
        enum: MatchingStatusType,
        isArray: true,
        explode: false,
        required: true,
    })
    @ApiQuery({
        name: 'search',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiQuery({
        name: 'page',
    })
    @ApiResponse({ type: MatchingDto, description: 'get-history' })
    async getHistory(
        @Query() getHistoryDto: GetHistoryDto,
        @AuthUser() fromUser: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const history = await this._matchingService.getHistory(
            fromUser.id,
            getHistoryDto,
        );

        return {
            description: 'history',
            data: history.items.map((item) => ({
                profile: item.toProfile,
                status: item.status,
                date: item.updatedAt,
            })),
            meta: history.meta,
            links: history.links,
        };
    }
}
