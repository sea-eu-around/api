import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { OfferDto } from '../../dto/OfferDto';
import { GetOffersQueryDto } from './dto/GetOffersQueryDto';
import { OfferService } from './offer.service';

@Controller('offers')
@ApiTags('offers')
export class OfferController {
    constructor(private _offerService: OfferService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({
        name: 'updatedAt',
        type: 'date',
        required: false,
    })
    @ApiOkResponse({
        type: OfferDto,
        description: 'Get all offers',
    })
    async getMany(
        @Query() query?: GetOffersQueryDto,
    ): Promise<PayloadSuccessDto> {
        const offers = await this._offerService.getMany(query);

        return {
            description: 'successfully-get-offers',
            data: offers,
        };
    }
}
