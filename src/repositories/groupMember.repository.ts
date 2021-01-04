import { EntityRepository, Repository } from 'typeorm';

import { GroupMemberEntity } from '../entities/groupMember.entity';

@EntityRepository(GroupMemberEntity)
export class GroupMemberRepository extends Repository<GroupMemberEntity> {}
