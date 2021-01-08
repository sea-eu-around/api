import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { GroupMemberRoleType } from '../../../../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../../../../common/constants/group-member-status-type';

export class UpdateGroupMemberPayloadDto {
    @ApiPropertyOptional({ enum: GroupMemberStatusType })
    @IsOptional()
    @IsEnum(GroupMemberStatusType)
    readonly status?: GroupMemberStatusType;

    @ApiPropertyOptional({ enum: GroupMemberRoleType })
    @IsOptional()
    @IsEnum(GroupMemberRoleType)
    readonly role?: GroupMemberRoleType;
}
