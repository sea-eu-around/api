import { ApiPropertyOptional } from '@nestjs/swagger';

import { GroupMemberRoleType } from '../common/constants/group-member-role-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { GroupMemberEntity } from '../entities/groupMember.entity';
import { UtilsService } from '../providers/utils.service';
import { GroupDto } from './GroupDto';
import { ProfileDto } from './ProfileDto';

export class GroupMemberDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    profileId: string;

    @ApiPropertyOptional()
    profile: ProfileDto;

    @ApiPropertyOptional()
    group: GroupDto;

    @ApiPropertyOptional()
    groupId: string;

    @ApiPropertyOptional()
    role: GroupMemberRoleType;

    constructor(groupMember: GroupMemberEntity) {
        super();
        this.group = UtilsService.isDto(groupMember.group)
            ? groupMember.group.toDto()
            : null;
        this.profile = UtilsService.isDto(groupMember.profile)
            ? groupMember.profile.toDto()
            : null;
        this.profileId = groupMember.profileId;
        this.groupId = groupMember.groupId;
        this.role = groupMember.role;
    }
}
