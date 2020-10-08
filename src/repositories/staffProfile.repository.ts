import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { StaffProfileEntity } from '../entities/staffProfile.entity';

@EntityRepository(StaffProfileEntity)
export class StaffProfileRepository extends Repository<StaffProfileEntity> {}
