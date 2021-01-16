import { ApiProperty } from '@nestjs/swagger';

import { MatchingStatusType } from '../common/constants/matching-status-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { MatchingEntity } from '../entities/matching.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';

export class MatchingDto extends AbstractDto {
    @ApiProperty()
    fromProfile: ProfileDto;

    @ApiProperty()
    toProfile: ProfileDto;

    @ApiProperty()
    status: MatchingStatusType;

    @ApiProperty()
    roomId?: string;

    constructor(matching: MatchingEntity) {
        super(matching);
        this.fromProfile = UtilsService.isDto(matching.fromProfile)
            ? matching.fromProfile.toDto()
            : null;
        this.toProfile = UtilsService.isDto(matching.toProfile)
            ? matching.toProfile.toDto()
            : null;
        this.status = matching.status;
        this.roomId = matching.room.id;
    }
}
