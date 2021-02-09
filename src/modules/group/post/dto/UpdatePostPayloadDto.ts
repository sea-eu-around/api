import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { PostType } from '../../../../common/constants/post-type';

export class UpdatePostPayloadDto {
    @ApiProperty({ enum: PostType })
    @IsEnum(PostType)
    readonly type: PostType;

    @ApiProperty()
    @IsString()
    readonly text: string;
}
