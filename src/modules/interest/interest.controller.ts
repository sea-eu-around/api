import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { InterestDto } from '../../dto/InterestDto';
import { InterestEntity } from '../../entities/interest.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { CreateInterestDto } from './dto/createInterestDto';
import { GetInterestsQueryDto } from './dto/GetInterestsQueryDto';
import { InterestService } from './interest.service';

@Controller('interests')
@ApiTags('interests')
export class InterestController {
    constructor(private _interestService: InterestService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({
        type: InterestDto,
        description: 'Create new interest',
    })
    async createInterest(
        @Body() createInterestDto: CreateInterestDto,
    ): Promise<PayloadSuccessDto> {
        const interest = await this._interestService.createInterest(
            createInterestDto.key,
        );

        return {
            description: 'Successfully created interest',
            data: interest,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({
        name: 'date',
        type: 'date',
        required: false,
    })
    @ApiOkResponse({
        type: InterestEntity,
        description: 'get all interests',
    })
    async getMany(query: GetInterestsQueryDto): Promise<PayloadSuccessDto> {
        const interests = await this._interestService.getMany(query);
        return {
            description: 'interests',
            data: interests,
        };
    }
}
