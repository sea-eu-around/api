import { ApiPropertyOptional } from '@nestjs/swagger';

import { StaffRoleType } from '../common/constants/staff-role-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { StaffRoleEntity } from '../entities/staffRole.entity';

export class StaffRoleDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    id: StaffRoleType;

    constructor(staffRole: StaffRoleEntity) {
        super();
        this.id = staffRole.id;
    }
}
