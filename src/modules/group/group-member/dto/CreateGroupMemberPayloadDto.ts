import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { Exists } from '../../../../decorators/exists-validator.decorator';
import { ProfileEntity } from '../../../../entities/profile.entity';

export class CreateGroupMemberPayloadDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    @Exists<ProfileEntity>(ProfileEntity, 'id')
    readonly profileId?: string;
}
