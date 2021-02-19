import { IsEnum, IsUUID } from 'class-validator';

import { GroupMemberInvitationStatusType } from '../../../../common/constants/group-member-status-type';

export class CreateGroupMemberParamsDto {
    @IsUUID()
    readonly groupId!: string;

    @IsEnum(GroupMemberInvitationStatusType)
    readonly status: GroupMemberInvitationStatusType;
}
