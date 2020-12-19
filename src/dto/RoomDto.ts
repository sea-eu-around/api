import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../common/dto/AbstractDto';
import { MessageEntity } from '../entities/message.entity';
import { RoomEntity } from '../entities/room.entity';
import { UtilsService } from '../providers/utils.service';
import { MatchingDto } from './MatchingDto';
import { MessageDto } from './MessageDto';
import { ProfileRoomDto } from './ProfileRoomDto';

export class RoomDto extends AbstractDto {
    @ApiPropertyOptional()
    messages: MessageDto[];

    @ApiPropertyOptional({ type: () => MessageEntity })
    lastMessage: MessageDto;

    @ApiPropertyOptional()
    matching?: MatchingDto;

    @ApiPropertyOptional()
    profiles: ProfileRoomDto[];

    constructor(room: RoomEntity) {
        super(room);
        this.updatedAt = room.updatedAt;
        this.lastMessage = UtilsService.isDto(room.lastMessage)
            ? room.lastMessage.toDto()
            : room.lastMessage;
        this.messages = UtilsService.isDtos(room.messages)
            ? room.messages.toDtos()
            : null;
        this.matching = UtilsService.isDtos(room.matching)
            ? room.matching.toDto()
            : null;
        this.profiles = UtilsService.isDtos(room.profiles)
            ? room.profiles.toDtos()
            : null;
    }
}
