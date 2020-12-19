import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileRepository } from '../../repositories/profile.repository';
import { ReportRepository } from '../../repositories/report.repository';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProfileRepository, ReportRepository])],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService],
})
export class ReportModule {}
