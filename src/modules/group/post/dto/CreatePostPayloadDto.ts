import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PostType } from '../../../../common/constants/post-type';

export class CreatePostPayloadDto {
    @ApiProperty()
    readonly type: PostType;

    @ApiProperty()
    @IsString()
    readonly text: string;
}
