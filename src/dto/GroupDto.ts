import { ApiPropertyOptional } from '@nestjs/swagger';

import { GroupMemberRoleType } from '../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../common/constants/group-member-status-type';
import { AbstractDto } from '../common/dto/AbstractDto';
import { GroupEntity } from '../entities/group.entity';
import { UtilsService } from '../providers/utils.service';
import { GroupMemberDto } from './GroupMemberDto';

export class GroupDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    visible: boolean;

    @ApiPropertyOptional()
    requiresApproval: boolean;

    @ApiPropertyOptional()
    members: GroupMemberDto[];

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()
    cover?: string;

    @ApiPropertyOptional()
    isMember?: boolean;

    @ApiPropertyOptional()
    role?: GroupMemberRoleType;

    @ApiPropertyOptional()
    status?: GroupMemberStatusType;

    constructor(group: GroupEntity) {
        super(group);
        this.name = group.name;
        this.visible = group.visible;
        this.requiresApproval = group.requiresApproval;
        this.members = UtilsService.isDtos(group.members)
            ? group.members.toDtos()
            : null;
        this.description = group.description;
        this.cover = UtilsService.isDto(group.cover)
            ? UtilsService.isImageFilename(group.cover.path)
                ? `https://aas-bucket.s3.eu-west-3.amazonaws.com/${group.cover.path}`
                : group.cover.path
            : null;
        this.isMember = group.isMember;
        this.role = group.role;
        this.status = group.status;
    }
}
