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
import { ProfileCreationDto } from './dto/ProfileCreationDto';
import { StaffProfileCreationDto } from './dto/StaffProfileCreationDto';
import { StudentProfileCreationDto } from './dto/StudentProfileCreationDto';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('profile')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class ProfileController {
    constructor(private _profileService: ProfileService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiExtraModels(StaffProfileCreationDto, StudentProfileCreationDto)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create profile',
        type: ProfileDto,
    })
    @ApiBody({
        schema: {
            oneOf: [
                { $ref: getSchemaPath(StaffProfileCreationDto) },
                { $ref: getSchemaPath(StudentProfileCreationDto) },
            ],
        },
    })
    @ApiQuery({ name: 'type', enum: ProfileType })
    async createProfile(
        @Body()
        profileCreationDto: ProfileCreationDto,
        @Query('type') type: ProfileType,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const createdProfile = await this._profileService.createProfile(
            profileCreationDto,
            type,
            user,
        );

        return createdProfile.toDto();
    }
}
