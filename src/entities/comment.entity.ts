import {
    AfterInsert,
    AfterRemove,
    Column,
    Entity,
    getConnection,
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

    @AfterInsert()
    async increaseCommentsCounter(): Promise<void> {
        const id = this.postId != null ? this.postId : 0;
        const query =
            '" SET "comments_count" = comments_count + 1 WHERE "id" = $1'; // To avoid updated_at to be changed
        await getConnection().query('UPDATE "' + 'post' + query, [id]);
    }

    @AfterRemove()
    async decreaseLikesCounter(): Promise<void> {
        const id = this.postId != null ? this.postId : 0;
        const query =
            '" SET "comments_count" = comments_count - 1 WHERE "id" = $1'; // To avoid updated_at to be changed
        await getConnection().query('UPDATE "' + 'post' + query, [id]);
    }

    isVoted: boolean;

    voteType: VoteType;

    dtoClass = CommentDto;
}
