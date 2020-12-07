import { ApiPropertyOptional } from '@nestjs/swagger';

import { StaffRoleType } from '../common/constants/staff-role-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';

export class StaffRoleDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    id: StaffRoleType;

    constructor() {
        super();
    }
}
