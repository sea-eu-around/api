import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentRepository } from '../../../../repositories/comment.repository';
import { GroupMemberRepository } from '../../../../repositories/group-member.repository';
import { PostRepository } from '../../../../repositories/post.repository';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CommentRepository,
            GroupMemberRepository,
            PostRepository,
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
