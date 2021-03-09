import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupMemberRepository } from '../../../repositories/group-member.repository';
import { GroupRepository } from '../../../repositories/group.repository';
import { PostRepository } from '../../../repositories/post.repository';
import { UserRepository } from '../../user/user.repository';
import { GroupMemberController } from './group-member.controller';
import { GroupMemberService } from './group-member.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GroupRepository,
            GroupMemberRepository,
            UserRepository,
            PostRepository,
        ]),
    ],
    providers: [GroupMemberService],
    controllers: [GroupMemberController],
})
export class GroupMemberModule {}
