import { ApiPropertyOptional } from '@nestjs/swagger';

import { StaffRoleType } from '../common/constants/staff-role-type';
import { StaffProfileEntity } from '../entities/staffProfile.entity';
import { ProfileDto } from './ProfileDto';

export class StaffProfileDto extends ProfileDto {
    @ApiPropertyOptional()
    staffRole: StaffRoleType;

    constructor(profile: StaffProfileEntity) {
        super(profile);
        this.staffRole = profile.staffRole;
    }
}
