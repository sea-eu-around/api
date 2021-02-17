import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExistsConstraint } from '../../../../decorators/exists-validator.decorator';
import { CommentRepository } from '../../../../repositories/comment.repository';
import { GroupMemberRepository } from '../../../../repositories/group-member.repository';
import { PostRepository } from '../../../../repositories/post.repository';
import { VoteRepository } from '../../../../repositories/vote.repository';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CommentRepository,
            GroupMemberRepository,
            PostRepository,
            VoteRepository,
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService, ExistsConstraint],
})
export class CommentModule {}
