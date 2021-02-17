import {
    Column,
    Entity,
    ManyToOne,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { VoteType } from '../common/constants/vote-type';
import { CommentDto } from '../dto/CommentDto';
import { PolymorphicChildren } from '../polymorphic/decorators';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';
import { ReportEntity } from './report.entity';
import { VoteEntity } from './vote.entity';

@Entity('comment')
@Tree('materialized-path')
export class CommentEntity extends AbstractEntity<CommentDto> {
    @Column()
    text!: string;

    @ManyToOne(() => ProfileEntity, { eager: true, onDelete: 'CASCADE' })
    creator: ProfileEntity;

    @Column()
    creatorId!: string;

    @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
    post: PostEntity;

    @Column()
    postId!: string;

    @TreeChildren()
    children?: CommentEntity[];

    @TreeParent()
    parent?: CommentEntity;

    @Column({ nullable: true })
    parentId?: string;

    @Column({
        default: 0,
    })
    upVotesCount?: number;

    @Column({
        default: 0,
    })
    downVotesCount?: number;

    @PolymorphicChildren(() => VoteEntity, {
        eager: false,
    })
    receivedVotes: VoteEntity[];

    @PolymorphicChildren(() => ReportEntity, {
        eager: false,
    })
    receivedReports: ReportEntity[];

    isVoted: boolean;

    voteType: VoteType;

    dtoClass = CommentDto;
}
