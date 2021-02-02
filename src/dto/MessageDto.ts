import { ApiPropertyOptional } from '@nestjs/swagger';
import { createDecipheriv } from 'crypto';

import { AbstractDto } from '../common/dto/AbstractDto';
import { MessageEntity } from '../entities/message.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';
import { RoomDto } from './RoomDto';

export class MessageDto extends AbstractDto {
    @ApiPropertyOptional()
    text: string;

    @ApiPropertyOptional()
    room: RoomDto;

    @ApiPropertyOptional()
    roomId: string;

    @ApiPropertyOptional()
    sender: ProfileDto;

    @ApiPropertyOptional()
    sent: boolean;

    @ApiPropertyOptional()
    senderId: string;

    constructor(message: MessageEntity) {
        super(message);
        this.updatedAt = message.updatedAt;
        this.sent = message.sent;
        this.senderId = message.senderId;
        this.roomId = message.roomId;
        this.room = UtilsService.isDto(message.room)
            ? message.room.toDto()
            : null;
        this.sender = UtilsService.isDto(message.sender)
            ? message.sender.toDto()
            : null;

        if (message.encrypted) {
            const decipher = createDecipheriv(
                'aes-256-ctr',
                new Buffer(process.env.CRYPTO_KEY, 'base64'),
                new Buffer(process.env.CRYPTO_IV, 'base64'),
            );
            this.text = Buffer.concat([
                decipher.update(message.text, 'base64'),
                decipher.final(),
            ]).toString();
        } else {
            this.text = message.text;
        }
    }
}
