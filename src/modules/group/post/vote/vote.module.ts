import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupMemberRepository } from '../../../../repositories/group-member.repository';
import { GroupRepository } from '../../../../repositories/group.repository';
import { VoteRepository } from '../../../../repositories/vote.repository';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VoteRepository,
            GroupRepository,
            GroupMemberRepository,
        ]),
    ],
    providers: [VoteService],
    controllers: [VoteController],
    exports: [VoteService],
})
export class VoteModule {}
