import { EntityRepository, Repository } from 'typeorm';

import { StudentProfileEntity } from '../entities/studentProfile.entity';

@EntityRepository(StudentProfileEntity)
export class StudentProfileRepository extends Repository<
    StudentProfileEntity
> {}
