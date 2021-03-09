import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { PayloadSuccessDto } from './common/dto/PayloadSuccessDto';

@Controller()
export class AppController {
    @Get('/ping')
    @HttpCode(HttpStatus.OK)
    ping(): PayloadSuccessDto {
        return {
            description: 'pong',
        };
    }
}
