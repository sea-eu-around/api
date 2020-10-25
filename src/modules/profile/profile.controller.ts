'use strict';

import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiExtraModels,
    ApiQuery,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';

import { ProfileType } from '../../common/constants/profile-type';
import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ProfileDto } from '../../dto/ProfileDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { AddInterestsToProfileDto } from './dto/AddInterestsToProfileDto';
import { AddLanguagesToProfileDto } from './dto/AddLanguagesToProfileDto';
import { StaffProfileCreationDto } from './dto/StaffProfileCreationDto';
import { StudentProfileCreationDto } from './dto/StudentProfileCreationDto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('profiles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class ProfileController {
    constructor(private _profileService: ProfileService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiExtraModels(StaffProfileCreationDto, StudentProfileCreationDto)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Profile successfully created',
        type: ProfileDto,
    })
    @ApiBody({
        schema: {
            oneOf: [
                { $ref: getSchemaPath(StaffProfileCreationDto) },
                { $ref: getSchemaPath(StudentProfileCreationDto) },
            ],
            discriminator: { propertyName: 'type' },
        },
    })
    @ApiQuery({ name: 'type', enum: ProfileType })
    async createProfile(
        @Query('type') type: ProfileType,
        @Body()
        profileCreationDto: StaffProfileCreationDto | StudentProfileCreationDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const createdProfile = await this._profileService.createProfile(
            profileCreationDto,
            type,
            user,
        );

        return {
            description: 'Profile successfully created',
            data: createdProfile,
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
    async addInterestToProfile(
        @Body() addInterestToProfileDto: AddInterestsToProfileDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._profileService.addInterestToProfile(
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
    async addLanguagesToProfile(
        @Body() addLanguagesToProfileDto: AddLanguagesToProfileDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const profile = await this._profileService.addLanguagesToProfile(
            addLanguagesToProfileDto,
            null,
            user,
        );

        return {
            description: 'Successfully added interests to user',
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
