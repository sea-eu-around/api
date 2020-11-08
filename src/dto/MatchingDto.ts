import { ApiProperty } from '@nestjs/swagger';

import { MatchingStatusType } from '../common/constants/matching-status-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { MatchingEntity } from '../entities/matching.entity';
import { ProfileEntity } from '../entities/profile.entity';

export class MatchingDto extends AbstractDto {
    @ApiProperty()
    fromProfile: ProfileEntity;

    @ApiProperty()
    toProfile: ProfileEntity;

    @ApiProperty()
    status: MatchingStatusType;

    constructor(matching: MatchingEntity) {
        super(matching);
        this.fromProfile = matching.fromProfile;
        this.toProfile = matching.toProfile;
        this.status = matching.status;
    }
}
