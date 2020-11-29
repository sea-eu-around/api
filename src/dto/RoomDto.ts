import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../common/dto/AbstractDto';
import { RoomEntity } from '../entities/room.entity';
import { UtilsService } from '../providers/utils.service';
import { MatchingDto } from './MatchingDto';
import { MessageDto } from './MessageDto';
import { ProfileRoomDto } from './ProfileRoomDto';

export class RoomDto extends AbstractDto {
    @ApiPropertyOptional()
    messages: MessageDto[];

    @ApiPropertyOptional()
    matching?: MatchingDto;

    @ApiPropertyOptional()
    profileRooms: ProfileRoomDto[];

    constructor(room: RoomEntity) {
        super(room);
        this.updatedAt = room.updatedAt;
        this.messages = UtilsService.isDtos(room.messages)
            ? room.messages.toDtos()
            : room.messages;
        this.matching = room.matching;
        this.profileRooms = UtilsService.isDtos(room.profileRooms)
            ? room.profileRooms.toDtos()
            : room.profileRooms;
    }
}
