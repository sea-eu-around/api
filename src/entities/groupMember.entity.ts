import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { GroupRoleType } from '../common/constants/group-role-type';
import { GroupMemberDto } from '../dto/GroupMemberDto';
import { GroupEntity } from './group.entity';
import { ProfileEntity } from './profile.entity';

@Entity('group_member')
export class GroupMemberEntity extends AbstractCompositeEntity<GroupMemberDto> {
    @Index()
    @Column()
    @PrimaryColumn()
    profileId!: string;

    @Index()
    @Column()
    @PrimaryColumn()
    groupId!: string;

    @ManyToOne(() => ProfileEntity, (profile) => profile.groups, {
        onDelete: 'CASCADE',
    })
    profile: ProfileEntity;

    @ManyToOne(() => GroupEntity, (group) => group.members, {
        onDelete: 'CASCADE',
    })
    group: GroupEntity;

    @Column({ type: 'enum', enum: GroupRoleType, default: GroupRoleType.BASIC })
    role: GroupRoleType;

    dtoClass = GroupMemberDto;
}
