import { EntityRepository, Repository } from 'typeorm';

import { GroupCoverEntity } from '../entities/group-cover.entity';

@EntityRepository(GroupCoverEntity)
export class GroupCoverRepository extends Repository<GroupCoverEntity> {}
