import { ApiPropertyOptional } from '@nestjs/swagger';

import { VoteType } from '../common/constants/vote-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { VoteEntity } from '../entities/vote.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';

export class VoteDto extends AbstractDto {
    @ApiPropertyOptional()
    voteType: VoteType;

    @ApiPropertyOptional()
    fromProfile: ProfileDto;

    @ApiPropertyOptional()
    entityId: string;

    @ApiPropertyOptional()
    entityType: string;

    constructor(vote: VoteEntity) {
        super(vote);
        this.voteType = vote.voteType;
        this.fromProfile = UtilsService.isDto(vote.fromProfile)
            ? vote.fromProfile.toDto()
            : vote.fromProfile;
        this.entityId = vote.entityId;
        this.entityType = vote.entityType;
    }
}
