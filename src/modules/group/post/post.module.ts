import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRepository } from '../../../repositories/group.repository';
import { GroupMemberRepository } from '../../../repositories/groupMember.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { CommentModule } from './comment/comment.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupRepository,
            PostRepository,
            GroupMemberRepository,
        ]),
        CommentModule,
    ],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule {}
