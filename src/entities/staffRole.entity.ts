import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { StaffRoleType } from '../common/constants/staff-role-type';
import { StaffRoleDto } from '../dto/StaffRoleDto';
import { StaffProfileEntity } from './staffProfile.entity';

@Entity('staff_role')
export class StaffRoleEntity extends AbstractCompositeEntity<StaffRoleDto> {
    @Index()
    @Column({ enum: StaffRoleType, type: 'enum' })
    @PrimaryColumn({ enum: StaffRoleType, type: 'enum' })
    id: StaffRoleType;

    @Index()
    @Column()
    @PrimaryColumn()
    profileId: string;

    @ManyToOne(() => StaffProfileEntity, (profile) => profile.staffRoles, {
        onDelete: 'CASCADE',
    })
    profile: StaffProfileEntity;

    dtoClass = StaffRoleDto;
}
