import { ApiPropertyOptional } from '@nestjs/swagger';

import { ReportType } from '../common/constants/report-type';
import { AbstractCompositeDto } from '../common/dto/AbstractCompositeDto';
import { ReportEntity } from '../entities/report.entity';

export class ReportDto extends AbstractCompositeDto {
    @ApiPropertyOptional()
    type: ReportType;

    @ApiPropertyOptional()
    entityId: string;

    @ApiPropertyOptional()
    entityType: string;

    constructor(report: ReportEntity) {
        super();
        this.type = report.type;
        this.entityId = report.entityId;
        this.entityType = report.entityType;
    }
}
