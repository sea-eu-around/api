import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../common/dto/AbstractDto';
import { MatchingEntity } from '../entities/matching.entity';
import { RoomEntity } from '../entities/room.entity';
import { UtilsService } from '../providers/utils.service';
import { MessageDto } from './MessageDto';
import { UserRoomDto } from './UserRoomDto';

export class RoomDto extends AbstractDto {
    @ApiPropertyOptional()
    messages: MessageDto[];

    @ApiPropertyOptional()
    matching?: MatchingEntity;

    @ApiPropertyOptional()
    userRooms: UserRoomDto[];

    constructor(room: RoomEntity) {
        super(room);
        this.messages = UtilsService.isDtos(room.messages)
            ? room.messages.toDtos()
            : room.messages;
        this.matching = room.matching;
        this.userRooms = UtilsService.isDtos(room.userRooms)
            ? room.userRooms.toDtos()
            : room.userRooms;
    }
}
