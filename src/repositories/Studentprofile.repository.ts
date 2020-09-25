import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { StudentProfileEntity } from '../entities/studentProfile.entity';

@EntityRepository(StudentProfileEntity)
export class StudentProfileRepository extends Repository<
    StudentProfileEntity
> {}
