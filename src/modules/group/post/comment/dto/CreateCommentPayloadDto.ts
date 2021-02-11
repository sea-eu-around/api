import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { Exists } from '../../../../../decorators/exists-validator.decorator';
import { CommentEntity } from '../../../../../entities/comment.entity';

export class CreateCommentPayloadDto {
    @ApiProperty()
    @IsString()
    readonly text: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    @Exists(CommentEntity, 'id')
    readonly parentId?: string;
}
