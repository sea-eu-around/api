import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { MediaEntity } from '../entities/media.entity';

export class MediaDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    path: string;

    constructor(media: MediaEntity) {
        super();
        this.path = media.path;
    }
}
