import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { FileType } from '../../common/constants/file-type';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { CommonService } from './common.service';

@Controller('common')
@ApiTags('Common')
export class CommonController {
    constructor(private _commonService: CommonService) {}

    @Get('signedUrl')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'mimeType', enum: FileType })
    async getSignedUrl(
        @Query('mimeType')
        mimeType: FileType,
    ): Promise<PayloadSuccessDto> {
        const signedUrl = await this._commonService.getSignedUrl(mimeType);
        return {
            description: 'successfully-generated-presigned-url',
            data: signedUrl,
        };
    }
}
