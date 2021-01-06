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

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { GroupDto } from '../../dto/GroupDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { CreateGroupPayloadDto } from './dto/CreateGroupPayloadDto';
import { GetManyGroupsQueryDto } from './dto/GetManyGroupsQueryDto';
import { GetOneGroupParamsDto } from './dto/GetOneParamsDto';
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
    @ApiResponse({
        type: GroupDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-groups',
    })
    async getMany(
        @Query() query: GetManyGroupsQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit = query.limit > 100 ? 100 : query.limit;

        const rooms = await this._groupService.getMany(user.id, {
            limit,
            page: query.page,
            route: 'http://localhost:3000/groups',
        });

        return {
            description: 'successefully-retrieved-groups',
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
    async getOne(
        @Param() params: GetOneGroupParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const group = await this._groupService.getOne(params.id, user.id);

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
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-group',
        type: GroupDto,
    })
    delete(@AuthUser() user: UserEntity): PayloadSuccessDto {
        return {
            description: 'successefully-deleted-group',
        };
    }

    @Get('/:id/members')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-retrieved-group-members',
        type: GroupDto,
    })
    getManyMembers(@AuthUser() user: UserEntity): PayloadSuccessDto {
        return {
            description: 'successefully-retrieved-group-members',
        };
    }

    @Post('/:id/members')
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-added-group-member',
        type: GroupDto,
    })
    addMember(@AuthUser() user: UserEntity): PayloadSuccessDto {
        return {
            description: 'successefully-added-group-member',
        };
    }

    @Patch('/:id/members/:id')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-updated-group-member',
        type: GroupDto,
    })
    updateMember(@AuthUser() user: UserEntity): PayloadSuccessDto {
        return {
            description: 'successefully-updated-group-member',
        };
    }

    @Delete('/:id/members/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-group-member',
        type: GroupDto,
    })
    deleteMember(@AuthUser() user: UserEntity): PayloadSuccessDto {
        return {
            description: 'successefully-delete-group-member',
        };
    }
}
