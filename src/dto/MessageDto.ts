import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../common/dto/AbstractDto';
import { MessageEntity } from '../entities/message.entity';
import { UtilsService } from '../providers/utils.service';
import { RoomDto } from './RoomDto';
import { UserDto } from './UserDto';

export class MessageDto extends AbstractDto {
    @ApiPropertyOptional()
    text: string;

    @ApiPropertyOptional()
    room: RoomDto;

    @ApiPropertyOptional()
    sender: UserDto;

    @ApiPropertyOptional()
    sent: boolean;

    constructor(message: MessageEntity) {
        super(message);
        this.text = message.text;
        this.sent = message.sent;
        this.room = UtilsService.isDto(message.room)
            ? message.room.toDto()
            : message.room;
        this.sender = UtilsService.isDto(message.sender)
            ? message.sender.toDto()
            : message.sender;
    }
}
