import { ApiProperty } from '@nestjs/swagger';

import { MatchingStatusType } from '../common/constants/matching-status-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { MatchingEntity } from '../entities/matching.entity';
import { UserDto } from './UserDto';

export class MatchingDto extends AbstractDto {
    @ApiProperty()
    fromUser: UserDto;

    @ApiProperty()
    toUser: UserDto;

    @ApiProperty()
    status: MatchingStatusType;

    constructor(matching: MatchingEntity) {
        super(matching);
        this.fromUser = matching.fromUser;
        this.toUser = matching.toUser;
        this.status = matching.status;
    }
}
