import { ApiProperty } from '@nestjs/swagger';

import { MatchingStatusType } from '../common/constants/matching-status-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { MatchingEntity } from '../entities/matching.entity';
import { ProfileDto } from './ProfileDto';

export class MatchingDto extends AbstractDto {
    @ApiProperty()
    fromProfile: ProfileDto;

    @ApiProperty()
    toProfile: ProfileDto;

    @ApiProperty()
    status: MatchingStatusType;

    constructor(matching: MatchingEntity) {
        super(matching);
        this.fromProfile = matching.fromProfile;
        this.toProfile = matching.toProfile;
        this.status = matching.status;
    }
}
