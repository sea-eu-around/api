import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupMemberRepository } from '../../repositories/group-member.repository';
import { GroupRepository } from '../../repositories/group.repository';
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
