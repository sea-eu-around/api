import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { GroupMemberStatusType } from '../../common/constants/group-member-status-type';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { GroupDto } from '../../dto/GroupDto';
import { ProfileDto } from '../../dto/ProfileDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { CreateGroupCoverParamsDto } from './dto/CreateGroupCoverParamsDto';
import { CreateGroupCoverPayloadDto } from './dto/CreateGroupCoverPayloadDto';
import { CreateGroupPayloadDto } from './dto/CreateGroupPayloadDto';
import { DeleteGroupParamsDto } from './dto/DeleteGroupParamsDto';
import { RetrieveAvailableMatchesParamsDto } from './dto/retrieveAvailableMatchesParamsDto';
import { RetrieveAvailableMatchesQueryDto } from './dto/retrieveAvailableMatchesQueryDto';
import { RetrieveGroupParamsDto } from './dto/RetrieveGroupParamsDto';
import { RetrieveGroupsFeedQueryDto } from './dto/RetrieveGroupsFeedQueryDto';
import { RetrieveGroupsQueryDto } from './dto/RetrieveGroupsQueryDto';
import { UpdateGroupParamsDto } from './dto/UpdateGroupParamsDto';
import { UpdateGroupPayloadDto } from './dto/UpdateGroupPayloadDto';
import { GroupService } from './group.service';

@Controller('groups')
@ApiTags('Groups')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class GroupController {
    constructor(private readonly _groupService: GroupService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'page',
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiQuery({
        name: 'statuses',
        type: 'enum',
        enum: GroupMemberStatusType,
        required: false,
        isArray: true,
        explode: false,
    })
    @ApiQuery({
        name: 'search',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'explore',
        type: 'boolean',
        required: false,
    })
    @ApiResponse({
        type: GroupDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-groups',
    })
    async retrieve(
        @Query() query: RetrieveGroupsQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit = query.limit > 100 ? 100 : query.limit;

        const rooms = await this._groupService.retrieve({
            user,
            options: {
                limit,
                page: query.page,
                route: 'http://localhost:3000/groups',
            },
            profileId: query.profileId,
            ...query,
        });

        return {
            description: 'successefully-retrieved-groups',
            data: rooms.items,
            meta: rooms.meta,
            links: rooms.links,
        };
    }

    @Get('/feed')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'page',
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiResponse({
        type: GroupDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-groups-feed',
    })
    async getFeed(
        @Query() query: RetrieveGroupsFeedQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit = query.limit > 100 ? 100 : query.limit;

        const rooms = await this._groupService.retrieveFeed({
            user,
            options: {
                limit,
                page: query.page,
                route: 'http://localhost:3000/groups/feed',
            },
            ...query,
        });

        return {
            description: 'successefully-retrieved-groups-feed',
            data: rooms.items,
            meta: rooms.meta,
            links: rooms.links,
        };
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-retrieved-group',
        type: GroupDto,
    })
    async retrieveOne(
        @Param() params: RetrieveGroupParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const group = await this._groupService.retrieveOne(params.id, user.id);

        return {
            description: 'successefully-retrieved-group',
            data: group,
        };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-created-group',
        type: GroupDto,
    })
    async create(
        @Body() createGroupPayloadDto: CreateGroupPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const group = await this._groupService.create(
            createGroupPayloadDto,
            user,
        );

        return {
            description: 'successefully-created-group',
            data: group,
        };
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-updated-group',
        type: GroupDto,
    })
    async update(
        @Param() updateGroupParamsDto: UpdateGroupParamsDto,
        @Body() updateGroupPayloadDto: UpdateGroupPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const group = await this._groupService.update(
            updateGroupParamsDto.id,
            updateGroupPayloadDto,
            user,
        );

        return {
            description: 'successefully-updated-group',
            data: group,
        };
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-group',
        type: GroupDto,
    })
    async delete(
        @Param() deleteGroupParamsDto: DeleteGroupParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._groupService.delete(deleteGroupParamsDto.id, user);

        return {
            description: 'successefully-deleted-group',
        };
    }

    @Post('/:id/cover')
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-created-cover',
        type: GroupDto,
    })
    async createCover(
        @Param() createGroupCoverParamsDto: CreateGroupCoverParamsDto,
        @Body() createGroupCoverPayloadDto: CreateGroupCoverPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const group = await this._groupService.updateCover({
            createGroupCoverPayloadDto,
            user,
            ...createGroupCoverParamsDto,
        });

        return {
            description: 'successefully-created-group-cover',
            data: group,
        };
    }

    @Get('/:id/availableMatches')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiQuery({
        name: 'search',
        type: 'string',
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-retrieved-matches',
        type: ProfileDto,
    })
    async retrieveAvailableMatches(
        @Param() params: RetrieveAvailableMatchesParamsDto,
        @Query() query: RetrieveAvailableMatchesQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const profiles = await this._groupService.retrieveAvailableMatches({
            profileId: user.id,
            groupId: params.id,
            ...query,
        });

        return {
            description: 'successefully-retrieved-profiles',
            data: profiles,
        };
    }
}
