import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
    constructor(private _seedService: SeedService) {}

    @Get('users/:n')
    @HttpCode(HttpStatus.OK)
    async generateUsers(@Param('n') n: number): Promise<PayloadSuccessDto> {
        const users = await this._seedService.generateUsers(n);

        return {
            description: `Successfully generated ${n} users`,
            data: users,
        };
    }

    @Get('profiles/:n')
    @HttpCode(HttpStatus.OK)
    async generateProfiles(@Param('n') n: number): Promise<PayloadSuccessDto> {
        const profiles = await this._seedService.generateProfiles(n);

        return {
            description: `Successfully generated ${n} profiles`,
            data: profiles,
        };
    }
}
