import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SimplePostEntity } from '../entities/simplePost.entity';

@EntityRepository(SimplePostEntity)
export class SimplePostRepository extends Repository<SimplePostEntity> {}
