'use strict';

import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';

import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { ProfileService } from './profile.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class ProfileController {
    constructor(
        private _profileService: ProfileService,
        private readonly _i18n: I18nService,
    ) {}
}
