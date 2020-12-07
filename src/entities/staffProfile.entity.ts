import { ChildEntity, Column, OneToMany } from 'typeorm';

import { ProfileType } from '../common/constants/profile-type';
import { StaffRoleType } from '../common/constants/staff-role-type';
import { StaffProfileDto } from '../dto/StaffProfileDto';
import { ProfileEntity } from './profile.entity';
import { StaffRoleEntity } from './staffRole.entity';

@ChildEntity(ProfileType.STAFF)
export class StaffProfileEntity extends ProfileEntity {
    @OneToMany(() => StaffRoleEntity, (staffRole) => staffRole.profile, {
        eager: true,
        onDelete: 'CASCADE',
    })
    staffRoles: StaffRoleEntity[];

    @Column({ type: 'enum', enum: StaffRoleType })
    staffRole: StaffRoleType;

    dtoClass = StaffProfileDto;
}
