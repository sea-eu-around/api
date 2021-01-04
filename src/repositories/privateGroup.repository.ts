import { EntityRepository, Repository } from 'typeorm';

import { PrivateGroupEntity } from '../entities/privateGroup.entity';

@EntityRepository(PrivateGroupEntity)
export class PrivateGroupRepository extends Repository<PrivateGroupEntity> {}
