import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import { GroupMemberRoleType } from '../common/constants/group-member-role-type';
import { GroupMemberStatusType } from '../common/constants/group-member-status-type';
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

    @Column({
        type: 'enum',
        enum: GroupMemberRoleType,
        default: GroupMemberRoleType.BASIC,
    })
    role: GroupMemberRoleType;

    @Column({
        type: 'enum',
        enum: GroupMemberStatusType,
        default: GroupMemberStatusType.PENDING,
    })
    status: GroupMemberStatusType;

    dtoClass = GroupMemberDto;
}
