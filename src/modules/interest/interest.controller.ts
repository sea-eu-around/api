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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { InterestDto } from '../../dto/InterestDto';
import { ProfileDto } from '../../dto/ProfileDto';
import { ProfileEntity } from '../../entities/profile.entity';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { AddInterestToProfileDto } from './dto/addInterestToProfileDto';
import { InterestService } from './interest.service';

@Controller('interest')
@ApiTags('interest')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class InterestController {
    constructor(private _interestService: InterestService) {}

    @Post('create')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: InterestDto,
        description: 'Create new interest',
    })
    async createInterest(@Body() name: string): Promise<PayloadSuccessDto> {
        const interest = await this._interestService.createInterest(name);

        return {
            description: 'Successfully created interest',
            data: interest,
        };
    }

    @Post('profile/add')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ProfileDto,
        description: 'Add new interests to profile',
    })
    async addInterestToProfile(
        @Body() addInterestToProfileDto: AddInterestToProfileDto,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._interestService.addInterestToProfile(
            addInterestToProfileDto.profile,
            addInterestToProfileDto.interests,
        );

        return {
            description: 'Successfully added interests to user',
            data: profile,
        };
    }

    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: InterestDto,
        description: "get a profile's interests",
    })
    async getProfileInterests(
        @Body() userProfile: ProfileEntity,
    ): Promise<PayloadSuccessDto> {
        const interests = await this._interestService.getProfileInterests(
            userProfile,
        );

        return {
            description: "Profile's interests",
            data: interests,
        };
    }
}
