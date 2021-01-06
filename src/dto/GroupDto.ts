import { ApiPropertyOptional } from '@nestjs/swagger';

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

    constructor(group: GroupEntity) {
        super(group);
        this.name = group.name;
        this.visible = group.visible;
        this.requiresApproval = group.requiresApproval;
        this.members = UtilsService.isDtos(group.members)
            ? group.members.toDtos()
            : null;
    }
}
