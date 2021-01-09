import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRepository } from '../../repositories/group.repository';
import { GroupMemberRepository } from '../../repositories/groupMember.repository';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { PostModule } from './post/post.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GroupRepository, GroupMemberRepository]),
        PostModule,
    ],
    providers: [GroupService],
    controllers: [GroupController],
    exports: [GroupService],
})
export class GroupModule {}
