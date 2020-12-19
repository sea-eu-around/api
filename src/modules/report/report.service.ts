import { Injectable } from '@nestjs/common';

import { ReportEntity } from '../../entities/report.entity';
import { UserEntity } from '../../entities/user.entity';
import { ReportRepository } from '../../repositories/report.repository';
import { CreateReportDto } from './dto/CreateReportDto';

@Injectable()
export class ReportService {
    constructor(private readonly _reportRepository: ReportRepository) {}

    async createReport(
        createReportDto: CreateReportDto,
        user: UserEntity,
    ): Promise<ReportEntity> {
        const report = new ReportEntity();

        Object.assign(report, createReportDto);
        report.profileId = user.id;

        return this._reportRepository.save(report);
    }
}
