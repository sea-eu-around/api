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
import { DeleteGroupParamsDto } from './dto/DeleteGroupParamsDto';
import { RetrieveGroupParamsDto } from './dto/RetrieveGroupParamsDto';
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
}
