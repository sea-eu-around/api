import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { InterestEntity } from '../../entities/interest.entity';

@EntityRepository(InterestEntity)
export class InterestRepository extends Repository<InterestEntity> {}
