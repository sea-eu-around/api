import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ProfileRoomEntity } from '../entities/profileRoom.entity';
import { UtilsService } from '../providers/utils.service';
import { RoomDto } from './RoomDto';

export class ProfileRoomDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    profileId: string;

    @ApiPropertyOptional()
    room: RoomDto;

    @ApiPropertyOptional()
    roomId: string;

    @ApiPropertyOptional()
    lastMessageSeenDate?: Date;

    @ApiPropertyOptional()
    lastMessageSeenId?: string;

    constructor(profileRoom: ProfileRoomEntity) {
        super();
        this.room = UtilsService.isDto(profileRoom.room)
            ? profileRoom.room.toDto()
            : profileRoom.room;
        if (UtilsService.isDto(profileRoom.profile)) {
            Object.assign(this, profileRoom.profile.toDto());
        }
        this.lastMessageSeenDate = profileRoom.lastMessageSeenDate;
        this.lastMessageSeenId = profileRoom.lastMessageSeenId;
    }
}
