import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRepository } from '../../repositories/group.repository';
import { GroupMemberRepository } from '../../repositories/groupMember.repository';
import { PostRepository } from '../../repositories/post.repository';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupRepository,
            GroupMemberRepository,
            PostRepository,
        ]),
    ],
    providers: [GroupService],
    controllers: [GroupController],
    exports: [GroupService],
})
export class GroupModule {}
