import { EntityRepository, Repository } from 'typeorm';

import { PublicGroupEntity } from '../entities/publicGroup.entity';

@EntityRepository(PublicGroupEntity)
export class PublicGroupRepository extends Repository<PublicGroupEntity> {}
