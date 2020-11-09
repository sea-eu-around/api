import { EntityRepository, Repository } from 'typeorm';

import { MatchingEntity } from '../entities/matching.entity';

@EntityRepository(MatchingEntity)
export class MatchingRepository extends Repository<MatchingEntity> {}
