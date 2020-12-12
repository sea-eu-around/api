import { EntityRepository, Repository } from 'typeorm';

import { StaffRoleEntity } from '../entities/staffRole.entity';

@EntityRepository(StaffRoleEntity)
export class StaffRoleRepository extends Repository<StaffRoleEntity> {}
