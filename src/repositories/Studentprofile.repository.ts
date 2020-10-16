import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { StudentProfileEntity } from '../entities/studentProfile.entity';
import { ProfileRepository } from './profile.repository';

@EntityRepository(StudentProfileEntity)
export class StudentProfileRepository extends ProfileRepository {}
