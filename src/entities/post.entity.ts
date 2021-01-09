import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { PostStatusType } from '../common/constants/post-status-type';
import { PostType } from '../common/constants/post-type';
import { PostDto } from '../dto/PostDto';
import { GroupEntity } from './group.entity';
import { ProfileEntity } from './profile.entity';

@Entity('post')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: PostType } })
export abstract class PostEntity extends AbstractEntity<PostDto> {
    @Column({ type: 'enum', enum: PostType })
    type: PostType;

    @Column()
    status: PostStatusType;

    @Column()
    text: string;

    @ManyToOne(() => ProfileEntity, { onDelete: 'CASCADE' })
    creator: ProfileEntity;

    @ManyToOne(() => GroupEntity, { onDelete: 'CASCADE' })
    group: GroupEntity;

    @Column()
    groupId: string;

    @Column()
    creatorId: string;

    dtoClass = PostDto;
}
