import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import { AbstractEntity } from '../common/abstract.entity';
import { PostStatusType } from '../common/constants/post-status-type';
import { PostType } from '../common/constants/post-type';
import { PostDto } from '../dto/PostDto';
import { PolymorphicChildren } from '../polymorphic/decorators';
import { GroupEntity } from './group.entity';
import { ProfileEntity } from './profile.entity';
import { ReportEntity } from './report.entity';
import { VoteEntity } from './vote.entity';

@Entity('post')
@TableInheritance({ column: { type: 'enum', name: 'type', enum: PostType } })
export abstract class PostEntity extends AbstractEntity<PostDto> {
    @Column({ type: 'enum', enum: PostType })
    type: PostType;

    @Column()
    status: PostStatusType;

    @Column()
    text: string;

    @ManyToOne(() => ProfileEntity, { eager: true, onDelete: 'CASCADE' })
    creator: ProfileEntity;

    @ManyToOne(() => GroupEntity, { onDelete: 'CASCADE' })
    group: GroupEntity;

    @Column()
    groupId: string;

    @Column()
    creatorId: string;

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

    dtoClass = PostDto;
}
