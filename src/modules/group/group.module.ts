import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentRepository } from '../../repositories/comment.repository';
import { GroupCoverRepository } from '../../repositories/group-cover.repository';
import { GroupMemberRepository } from '../../repositories/group-member.repository';
import { GroupRepository } from '../../repositories/group.repository';
import { PostRepository } from '../../repositories/post.repository';
import { GroupMemberModule } from './group-member/group-member.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { PostModule } from './post/post.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupRepository,
            GroupMemberRepository,
            GroupCoverRepository,
            CommentRepository,
            PostRepository,
        ]),
        GroupMemberModule,
        PostModule,
    ],
    providers: [GroupService],
    controllers: [GroupController],
    exports: [GroupService],
})
export class GroupModule {}
