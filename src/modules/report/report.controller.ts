import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { CreateReportDto } from './dto/CreateReportDto';
import { ReportService } from './report.service';

@Controller('reports')
@ApiTags('Reports')
export class ReportController {
    constructor(private readonly _reportService: ReportService) {}
    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    async createReport(
        @Body() createReportDto: CreateReportDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const report = await this._reportService.createReport(
            createReportDto,
            user,
        );

        return {
            description: 'successfully-created-report',
            data: report,
        };
    }
}
