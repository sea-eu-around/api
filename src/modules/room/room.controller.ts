import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { RoomDto } from '../../dto/RoomDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
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
}
