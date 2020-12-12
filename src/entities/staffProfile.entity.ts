import { ChildEntity, OneToMany } from 'typeorm';

import { ProfileType } from '../common/constants/profile-type';
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

    dtoClass = StaffProfileDto;
}
