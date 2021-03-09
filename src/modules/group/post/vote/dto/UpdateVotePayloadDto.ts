import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { VoteType } from '../../../../../common/constants/vote-type';

export class UpdateVotePayloadDto {
    @ApiProperty({ enum: VoteType })
    @IsEnum(VoteType)
    voteType: VoteType;
}
