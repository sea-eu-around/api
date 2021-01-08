import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRepository } from '../../repositories/group.repository';
import { GroupMemberRepository } from '../../repositories/groupMember.repository';
import { GroupMemberModule } from './group-member/group-member.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([GroupRepository, GroupMemberRepository]),
        GroupMemberModule,
    ],
    providers: [GroupService],
    controllers: [GroupController],
    exports: [GroupService],
})
export class GroupModule {}
