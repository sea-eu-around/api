import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRepository } from '../../../repositories/group.repository';
import { GroupMemberRepository } from '../../../repositories/groupMember.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { SimplePostRepository } from '../../../repositories/simple-post.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupRepository,
            PostRepository,
            GroupMemberRepository,
            SimplePostRepository,
        ]),
    ],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule {}
