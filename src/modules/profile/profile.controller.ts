'use strict';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ProfileDto } from '../../dto/ProfileDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguageToProfileDto } from './dto/AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './dto/AddOfferToProfileDto';
import { ProfileCreationDto } from './dto/ProfileCreationDto';
import { ProfileUpdateDto } from './dto/ProfileUpdateDto';
import { StaffProfileCreationDto } from './dto/StaffProfileCreationDto';
import { StudentProfileCreationDto } from './dto/StudentProfileCreationDto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('profiles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class ProfileController {
    constructor(private _profileService: ProfileService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.OK,
        description: 'Get Profiles',
    })
    async getProfiles(
        @Query('page') page: number,
        @Query('limit') limit: number,
    ): Promise<PayloadSuccessDto> {
        limit = limit > 100 ? 100 : limit;

        const profiles = await this._profileService.getProfiles({
            page,
            limit,
            route: 'http://localhost:3000/profiles',
        });

        return {
            description: 'Profiles',
            data: profiles.items,
            meta: profiles.meta,
            links: profiles.links,
        };
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.OK,
        description: "get a profile's interests",
    })
    async findOneById(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._profileService.findOneById(id || user.id);

        return {
            description: "Profile's interests",
            data: profile,
        };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiExtraModels(StaffProfileCreationDto, StudentProfileCreationDto)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'profile-created',
        type: ProfileDto,
    })
    async create(
        @Body()
        profileCreationDto: ProfileCreationDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const createdProfile = await this._profileService.createOrUpdate(
            profileCreationDto,
            user,
        );

        return {
            description: 'profile-created',
            data: createdProfile,
        };
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiExtraModels(StaffProfileCreationDto, StudentProfileCreationDto)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'profile-updated',
        type: ProfileDto,
    })
    async update(
        @Body()
        profileUpdateDto: ProfileUpdateDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const updatedProfile = await this._profileService.createOrUpdate(
            profileUpdateDto,
            user,
        );

        return {
            description: 'profile-updated',
            data: updatedProfile,
        };
    }

    @Post('/interests')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.CREATED,
        description: 'Add new interests to profile',
    })
    async addInterest(
        @Body() addInterestToProfileDto: AddInterestsToProfileDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._profileService.addInterests(
            addInterestToProfileDto,
            null,
            user,
        );

        return {
            description: 'Successfully added interests to user',
            data: profile,
        };
    }

    @Post('/languages')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.CREATED,
        description: 'Add new interests to profile',
    })
    async addLanguages(
        @Body() addLanguagesToProfileDto: AddLanguageToProfileDto[],
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._profileService.addLanguages(
            addLanguagesToProfileDto,
            null,
            user,
        );

        return {
            description: 'Successfully added interests to profile',
            data: profile,
        };
    }

    @Post('/offers')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.CREATED,
        description: 'Add new interests to profile',
    })
    async addOffers(
        @Body() addOffersToProfileDto: AddOfferToProfileDto[],
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._profileService.addOffers(
            addOffersToProfileDto,
            null,
            user,
        );

        return {
            description: 'Successfully added offers to profile',
            data: profile,
        };
    }

    /*@Get('/interests')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.OK,
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
    }*/
}
