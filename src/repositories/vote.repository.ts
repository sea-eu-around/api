import { EntityRepository } from 'typeorm';

import { VoteEntity } from '../entities/vote.entity';
import { AbstractPolymorphicRepository } from '../polymorphic/polymorphic.repository';

@EntityRepository(VoteEntity)
export class VoteRepository extends AbstractPolymorphicRepository<VoteEntity> {}
