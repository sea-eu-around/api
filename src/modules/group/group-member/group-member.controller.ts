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

import { GroupMemberStatusType } from '../../../common/constants/group-member-status-type';
import { PayloadSuccessDto } from '../../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { GroupDto } from '../../../dto/GroupDto';
import { UserEntity } from '../../../entities/user.entity';
import { AuthGuard } from '../../../guards/auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { AuthUserInterceptor } from '../../../interceptors/auth-user-interceptor.service';
import { CreateGroupMemberParamsDto } from './dto/CreateGroupMemberParamsDto';
import { CreateGroupMemberPayloadDto } from './dto/CreateGroupMemberPayloadDto';
import { DeleteGroupMemberParamsDto } from './dto/DeleteGroupMemberParamsDto';
import { DeleteGroupMemberQuerydto } from './dto/DeleteGroupMemberQueryDto';
import { RetrieveGroupMembersParamsDto } from './dto/RetrieveGroupMembersParamsDto';
import { GetManyGroupMembersQueryDto } from './dto/RetrieveGroupMembersQueryDto';
import { UpdateGroupMemberParamsDto } from './dto/UpdateGroupMemberParamsDto';
import { UpdateGroupMemberPayloadDto } from './dto/UpdateGroupMemberPayloadDto';
import { GroupMemberService } from './group-member.service';

@Controller('/groups/:groupId/members')
@ApiTags('GroupMembers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class GroupMemberController {
    constructor(private readonly _groupMemberService: GroupMemberService) {}

    @Get()
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
        name: 'search',
        type: 'string',
        required: false,
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
    async retrieveGroupMembers(
        @Param() retrieveGroupMembersParamsDto: RetrieveGroupMembersParamsDto,
        @Query() retrieveGroupMembersQueryDto: GetManyGroupMembersQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit =
            retrieveGroupMembersQueryDto.limit > 100
                ? 100
                : retrieveGroupMembersQueryDto.limit;

        const members = await this._groupMemberService.retrieveMembers({
            user,
            groupId: retrieveGroupMembersParamsDto.groupId,
            options: {
                limit,
                page: retrieveGroupMembersQueryDto.page,
                route: `http://localhost:3000/groups/${retrieveGroupMembersParamsDto.groupId}/members`,
            },
            statuses: retrieveGroupMembersQueryDto.statuses,
            ...retrieveGroupMembersQueryDto,
        });

        return {
            description: 'successefully-retrieved-group-members',
            data: members.items,
            meta: members.meta,
            links: members.links,
        };
    }

    @Post()
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
        @Body() payload: CreateGroupMemberPayloadDto,
        @Param() params: CreateGroupMemberParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const groupMember = await this._groupMemberService.createGroupMember({
            user,
            ...params,
            ...payload,
        });

        return {
            description: 'successefully-created-group-member',
            data: groupMember,
        };
    }

    @Patch('/:profileId')
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
        const groupMember = await this._groupMemberService.updateGroupMember({
            ...updateGroupMemberParamsDto,
            updateGroupMemberPayloadDto,
            user,
        });

        return {
            description: 'successefully-updated-group-member',
            data: groupMember,
        };
    }

    @Delete('/:profileId?')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'profileId',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'cascade',
        type: 'boolean',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-group-member',
        type: GroupDto,
    })
    async deleteMember(
        @Query() query: DeleteGroupMemberQuerydto,
        @Param() deleteGroupMemberParamsDto: DeleteGroupMemberParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._groupMemberService.deleteGroupMember({
            ...deleteGroupMemberParamsDto,
            user,
            ...query,
        });

        return {
            description: 'successefully-delete-group-member',
        };
    }
}
