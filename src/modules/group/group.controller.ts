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
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { CreateGroupMemberParamsDto } from './dto/CreateGroupMemberParamsDto';
import { CreateGroupPayloadDto } from './dto/CreateGroupPayloadDto';
import { DeleteGroupParamsDto } from './dto/DeleteGroupParamsDto';
import { GetManyGroupMembersParamsDto } from './dto/GetManyGroupMembersParamsDto';
import { GetManyGroupMembersQueryDto } from './dto/GetManyGroupMembersQueryDto';
import { GetManyGroupsQueryDto } from './dto/GetManyGroupsQueryDto';
import { GetOneGroupParamsDto } from './dto/GetOneParamsDto';
import { UpdateGroupMemberParamsDto } from './dto/UpdateGroupMemberParamsDto';
import { UpdateGroupMemberPayloadDto } from './dto/UpdateGroupMemberPayloadDto';
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

        const rooms = await this._groupService.getMany({
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

    @Get('/:groupId/members')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
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
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-retrieved-group-members',
        type: GroupDto,
    })
    async getManyMembers(
        @Param() getManyGroupMembersParamsDto: GetManyGroupMembersParamsDto,
        @Query() getManyGroupMembersQueryDto: GetManyGroupMembersQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit =
            getManyGroupMembersQueryDto.limit > 100
                ? 100
                : getManyGroupMembersQueryDto.limit;

        const members = await this._groupService.getManyMembers(
            getManyGroupMembersParamsDto.groupId,
            {
                limit,
                page: getManyGroupMembersQueryDto.page,
                route: `http://localhost:3000/groups/${getManyGroupMembersParamsDto.groupId}/members`,
            },
            user,
            getManyGroupMembersQueryDto.statuses,
        );

        return {
            description: 'successefully-retrieved-group-members',
            data: members.items,
            meta: members.meta,
            links: members.links,
        };
    }

    @Post('/:groupId/members')
    @HttpCode(HttpStatus.CREATED)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-created-group-member',
        type: GroupDto,
    })
    async createGroupMember(
        @Param() createGroupMemberParamsDto: CreateGroupMemberParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const groupMember = await this._groupService.createGroupMember(
            createGroupMemberParamsDto.groupId,
            user.id,
        );

        return {
            description: 'successefully-created-group-member',
            data: groupMember,
        };
    }

    @Patch('/:groupId/members/:profileId')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'profileId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-updated-group-member',
        type: GroupDto,
    })
    async updateMember(
        @Param() updateGroupMemberParamsDto: UpdateGroupMemberParamsDto,
        @Body() updateGroupMemberPayloadDto: UpdateGroupMemberPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const groupMember = await this._groupService.updateGroupMember({
            ...updateGroupMemberParamsDto,
            updateGroupMemberPayloadDto,
            user,
        });

        return {
            description: 'successefully-updated-group-member',
            data: groupMember,
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
