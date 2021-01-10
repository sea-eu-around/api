import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../common/dto/AbstractDto';
import { ProfileDto } from './ProfileDto';

export class CommentDto extends AbstractDto {
    @ApiPropertyOptional()
    text: string;

    @ApiPropertyOptional()
    creator: ProfileDto;
}
