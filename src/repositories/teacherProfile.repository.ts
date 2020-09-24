import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { TeacherProfileEntity } from '../entities/teacherProfile.entity';

@EntityRepository(TeacherProfileEntity)
export class TeacherProfileRepository extends Repository<
    TeacherProfileEntity
> {}
