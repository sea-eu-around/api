import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { OfferDto } from '../../dto/OfferDto';
import { OfferService } from './offer.service';

@Controller('offers')
@ApiTags('offers')
export class OfferController {
    constructor(private _offerService: OfferService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: OfferDto,
        description: 'get all interests',
    })
    async getAllInterests(): Promise<PayloadSuccessDto> {
        const offers = await this._offerService.getMany();

        return {
            description: 'interests',
            data: offers,
        };
    }
}
