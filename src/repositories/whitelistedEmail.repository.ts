import { EntityRepository, Repository } from 'typeorm';

import { WhitelistedEmailEntity } from '../entities/whitelistedEmail.entity';

@EntityRepository(WhitelistedEmailEntity)
export class WhitelistedEmailRepository extends Repository<WhitelistedEmailEntity> {}
