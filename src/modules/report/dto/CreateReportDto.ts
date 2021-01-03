import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

import { ReportContentType } from '../../../common/constants/report-content-type';
import { ReportType } from '../../../common/constants/report-type';

export class CreateReportDto {
    @ApiProperty({ enum: ReportType })
    @IsEnum(ReportType)
    type: ReportType;

    @ApiProperty({ enum: ReportContentType })
    @IsEnum(ReportContentType)
    entityType: ReportContentType;

    @ApiProperty()
    @IsUUID()
    entityId: string;
}
