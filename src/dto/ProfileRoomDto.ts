import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ProfileRoomEntity } from '../entities/profileRoom.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';
import { RoomDto } from './RoomDto';

export class ProfileRoomDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    profile: ProfileDto;

    @ApiPropertyOptional()
    profileId: string;

    @ApiPropertyOptional()
    room: RoomDto;

    @ApiPropertyOptional()
    roomId: string;

    @ApiPropertyOptional()
    lastMessagesSeenId?: string;

    constructor(profileRoom: ProfileRoomEntity) {
        super();
        this.profile = UtilsService.isDto(profileRoom.profile)
            ? profileRoom.profile.toDto()
            : profileRoom.profile;
        this.room = UtilsService.isDto(profileRoom.room)
            ? profileRoom.room.toDto()
            : profileRoom.room;
        this.profileId = profileRoom.profileId;
        this.roomId = profileRoom.roomId;
    }
}
