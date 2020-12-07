import { ApiPropertyOptional } from '@nestjs/swagger';

import { StaffRoleType } from '../common/constants/staff-role-type';
import { StaffProfileEntity } from '../entities/staffProfile.entity';
import { UtilsService } from '../providers/utils.service';
import { ProfileDto } from './ProfileDto';
import { StaffRoleDto } from './StaffRoleDto';

export class StaffProfileDto extends ProfileDto {
    @ApiPropertyOptional()
    staffRoles?: StaffRoleDto[];

    @ApiPropertyOptional()
    staffRole: StaffRoleType;

    constructor(profile: StaffProfileEntity) {
        super(profile);
        this.staffRole = profile.staffRole;
        this.staffRoles = UtilsService.isDtos(profile.staffRoles)
            ? profile.staffRoles.toDtos()
            : profile.staffRoles;
    }
}
