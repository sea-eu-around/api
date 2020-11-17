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
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { DegreeType } from '../../common/constants/degree-type';
import { LanguageType } from '../../common/constants/language-type';
import { PartnerUniversity } from '../../common/constants/sea';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ProfileDto } from '../../dto/ProfileDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguageToProfileDto } from './dto/AddLanguageToProfileDto';
import { AddOfferToProfileDto } from './dto/AddOfferToProfileDto';
import { ProfileCreationDto } from './dto/ProfileCreationDto';
import { ProfileQueryDto } from './dto/ProfileQueryDto';
import { ProfileUpdateDto } from './dto/ProfileUpdateDto';
import { StaffProfileCreationDto } from './dto/StaffProfileCreationDto';
import { StudentProfileCreationDto } from './dto/StudentProfileCreationDto';
import { UpdateAvatarDto } from './dto/UpdateAvatarDto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('profiles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class ProfileController {
    constructor(
        private _profileService: ProfileService,
        private _awsS3Service: AwsS3Service,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'page',
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiQuery({
        name: 'universities',
        enum: PartnerUniversity,
        isArray: true,
        explode: false,
        required: false,
    })
    @ApiQuery({
        name: 'spokenLanguages',
        enum: LanguageType,
        isArray: true,
        explode: false,
        required: false,
    })
    @ApiQuery({
        name: 'degrees',
        enum: DegreeType,
        isArray: true,
        explode: false,
        required: false,
    })
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-profiles',
    })
    async getProfiles(
        @Query() query: ProfileQueryDto,
    ): Promise<PayloadSuccessDto> {
        const { page, universities, spokenLanguages, degrees } = query;

        const limit = query.limit > 100 ? 100 : query.limit;

        const profiles = await this._profileService.getProfiles(
            universities,
            spokenLanguages,
            degrees,
            {
                page,
                limit,
                route: 'http://localhost:3000/profiles',
            },
        );

        return {
            description: 'successefully-retrieved-profiles',
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

    @Post('avatar')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        type: ProfileDto,
        status: HttpStatus.CREATED,
        description: 'successfully-updated-avatar',
    })
    async updateAvatar(
        @Body() updateAvatarDto: UpdateAvatarDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const updatedProfile = await this._profileService.updateAvatar(
            updateAvatarDto,
            null,
            user,
        );

        return {
            description: 'successfully-updated-avatar',
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
