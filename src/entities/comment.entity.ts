import {
    Column,
    Entity,
    ManyToOne,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { CommentDto } from '../dto/CommentDto';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';

@Entity('comment')
@Tree('materialized-path')
export class CommentEntity extends AbstractEntity<CommentDto> {
    @Column()
    text: string;

    @ManyToOne(() => ProfileEntity)
    creator: ProfileEntity;

    @ManyToOne(() => PostEntity)
    post: PostEntity;

    @TreeChildren()
    children: CommentEntity[];

    @TreeParent()
    parent: CommentEntity;

    dtoClass = CommentDto;
}