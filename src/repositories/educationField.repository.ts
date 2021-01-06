import { EntityRepository, Repository } from 'typeorm';

import { EducationFieldEntity } from '../entities/educationField.entity';

@EntityRepository(EducationFieldEntity)
export class EducationFieldRepository extends Repository<EducationFieldEntity> {}
