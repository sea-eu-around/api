import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { InterestDto } from '../../dto/InterestDto';
import { ProfileDto } from '../../dto/ProfileDto';
import { InterestEntity } from '../../entities/interest.entity';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { AddInterestToProfileDto } from './dto/addInterestToProfileDto';
import { CreateInterestDto } from './dto/createInterestDto';
import { InterestService } from './interest.service';

@Controller('interest')
@ApiTags('interest')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
    async createInterest(
        @Body() createInterestDto: CreateInterestDto,
    ): Promise<PayloadSuccessDto> {
        const interest = await this._interestService.createInterest(
            createInterestDto.name,
        );

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
            addInterestToProfileDto.profileId,
            addInterestToProfileDto.interestIds,
        );

        return {
            description: 'Successfully added interests to user',
            data: profile,
        };
    }

    @Get('profile/:profileId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: InterestDto,
        description: "get a profile's interests",
    })
    async getProfileInterests(
        @Param('profileId') profileId: string,
    ): Promise<PayloadSuccessDto> {
        const interests = await this._interestService.getProfileInterests(
            profileId,
        );

        return {
            description: "Profile's interests",
            data: interests,
        };
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: InterestEntity,
        description: 'get all interests',
    })
    async getAllInterests(): Promise<PayloadSuccessDto> {
        const interests = await this._interestService.getAllInterests();
        return {
            description: 'interests',
            data: interests,
        };
    }
}
