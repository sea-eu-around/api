import { EntityRepository } from 'typeorm';

import { ReportEntity } from '../entities/report.entity';
import { AbstractPolymorphicRepository } from '../polymorphic/polymorphic.repository';

@EntityRepository(ReportEntity)
export class ReportRepository extends AbstractPolymorphicRepository<ReportEntity> {}
