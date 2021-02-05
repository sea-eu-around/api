import { ChildEntity, Column, ManyToOne } from 'typeorm';

import { MediaType } from '../common/constants/media-type';
import { GroupEntity } from './group.entity';
import { MediaEntity } from './media.entity';

@ChildEntity(MediaType.GROUP_COVER)
export class GroupCoverEntity extends MediaEntity {
    @ManyToOne(() => GroupEntity, { onDelete: 'CASCADE' })
    group: GroupEntity;

    @Column()
    groupId;
}
