import { ChildEntity, Column } from 'typeorm';

import { ProfileType } from '../common/constants/profile-type';
import { StaffRoleType } from '../common/constants/staff-role-type';
import { StaffProfileDto } from '../dto/StaffProfileDto';
import { ProfileEntity } from './profile.entity';

@ChildEntity(ProfileType.STAFF)
export class StaffProfileEntity extends ProfileEntity {
    @Column({ type: 'enum', enum: StaffRoleType })
    staffRole: StaffRoleType;

    dtoClass = StaffProfileDto;
}
