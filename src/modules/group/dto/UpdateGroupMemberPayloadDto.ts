import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { GroupMemberRoleType } from '../../../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../../../common/constants/group-member-status-type';

export class UpdateGroupMemberPayloadDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(GroupMemberStatusType)
    status: GroupMemberStatusType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(GroupMemberRoleType)
    role: GroupMemberRoleType;
}
