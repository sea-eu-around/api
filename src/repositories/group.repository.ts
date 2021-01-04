import { EntityRepository, Repository } from 'typeorm';

import { GroupEntity } from '../entities/group.entity';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {}
