import { ApiPropertyOptional } from '@nestjs/swagger';

import { StaffProfileEntity } from '../entities/staffProfile.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';
import { StaffRoleDto } from './StaffRoleDto';

export class StaffProfileDto extends ProfileDto {
    @ApiPropertyOptional()
    staffRoles?: StaffRoleDto[];

    constructor(profile: StaffProfileEntity) {
        super(profile);
        this.staffRoles = UtilsService.isDtos(profile.staffRoles)
            ? profile.staffRoles.toDtos()
            : profile.staffRoles;
    }
}
