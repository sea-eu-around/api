import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { GroupDto } from '../dto/GroupDto';
import { GroupMemberEntity } from './groupMember.entity';
import { ProfileEntity } from './profile.entity';

@Entity('group')
export class GroupEntity extends AbstractEntity<GroupDto> {
    @Column()
    name!: string;

    @Column()
    creatorId!: string;

    @OneToOne(() => ProfileEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    creator: ProfileEntity;

    @OneToMany(() => GroupMemberEntity, (groupMember) => groupMember.group, {
        cascade: true,
    })
    members: GroupMemberEntity[];

    @Column({ default: false })
    visible: boolean;

    @Column({ default: true })
    requiresApproval: boolean;

    dtoClass = GroupDto;
}
