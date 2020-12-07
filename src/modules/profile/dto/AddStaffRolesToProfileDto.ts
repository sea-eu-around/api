import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { StaffRoleType } from '../../../common/constants/staff-role-type';

export class AddStaffRolesToProfileDto {
    @ApiProperty()
    @IsEnum(StaffRoleType)
    id: StaffRoleType;
}
