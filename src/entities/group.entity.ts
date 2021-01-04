import { Column, Entity, OneToMany, TableInheritance } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { GroupType } from '../common/constants/group-type';
import { GroupDto } from '../dto/GroupDto';
import { GroupMemberEntity } from './groupMember.entity';

@Entity('group')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: GroupType } })
export abstract class GroupEntity extends AbstractEntity<GroupDto> {
    @Column()
    name: string;

    @OneToMany(() => GroupMemberEntity, (groupMember) => groupMember.group, {
        cascade: true,
    })
    members: GroupMemberEntity[];

    dtoClass = GroupDto;
}
