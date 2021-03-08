import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupMemberRepository } from '../../../repositories/group-member.repository';
import { GroupRepository } from '../../../repositories/group.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { SimplePostRepository } from '../../../repositories/simple-post.repository';
import { VoteRepository } from '../../../repositories/vote.repository';
import { CommentModule } from './comment/comment.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { VoteModule } from './vote/vote.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupRepository,
            PostRepository,
            GroupMemberRepository,
            SimplePostRepository,
            VoteRepository,
        ]),
        CommentModule,
        VoteModule,
    ],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule {}
