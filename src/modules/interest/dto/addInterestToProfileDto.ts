import { ApiProperty } from '@nestjs/swagger';

import { InterestEntity } from '../../../entities/interest.entity';
import { ProfileEntity } from '../../../entities/profile.entity';

export class AddInterestToProfileDto {
    @ApiProperty()
    readonly interests: InterestEntity[];

    @ApiProperty()
    readonly profile: ProfileEntity;

    constructor(interests: InterestEntity[], profile: ProfileEntity) {
        this.interests = interests;
        this.profile = profile;
    }
}
