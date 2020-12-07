import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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

import { RoomType } from '../../common/constants/room-type';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { RoomDto } from '../../dto/RoomDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { GetRoomParamsDto } from './dto/GetRoomParamsDto';
import { GetRoomsMessagesParamsDto } from './dto/GetRoomsMessagesParamsDto';
import { GetRoomsMessagesQueryDto } from './dto/GetRoomsMessagesQueryDto';
import { GetRoomsQueryDto } from './dto/GetRoomsQueryDto';
import { RoomService } from './room.service';

@Controller('rooms')
@ApiTags('Rooms')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class RoomController {
    constructor(private readonly _roomService: RoomService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'type',
        enum: RoomType,
        isArray: false,
        required: false,
    })
    @ApiQuery({
        name: 'page',
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiResponse({
        type: RoomDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-rooms',
    })
    async getRooms(
        @Query() query: GetRoomsQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit = query.limit > 100 ? 100 : query.limit;

        const rooms = await this._roomService.getRooms(user.id, {
            limit,
            page: query.page,
            route: 'http://localhost:3000/rooms',
        });

        return {
            description: 'successefully-retrieved-rooms',
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
        type: RoomDto,
        status: HttpStatus.OK,
        description: 'successfully-retrieved-rooms',
    })
    async getRoom(
        @Param() param: GetRoomParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const room = await this._roomService.getRoom(param.id, user.id);

        return {
            description: 'successfully-retrieved-room',
            data: room,
        };
    }

    @Get('/:id/messages')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiQuery({
        name: 'beforeDate',
        type: 'date',
        required: false,
    })
    @ApiQuery({
        name: 'page',
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiResponse({
        type: RoomDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-rooms',
    })
    async getRoomsMessages(
        @Param() params: GetRoomsMessagesParamsDto,
        @Query() query: GetRoomsMessagesQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit = query.limit > 100 ? 100 : query.limit;

        const rooms = await this._roomService.getRoomsMessages(
            user.id,
            params.id,
            {
                limit,
                page: query.page,
                route: 'http://localhost:3000/rooms',
            },
            query.beforeDate,
        );

        return {
            description: 'successefully-retrieved-rooms',
            data: rooms.items,
            meta: rooms.meta,
            links: rooms.links,
        };
    }
}
