import { ApiProperty } from '@nestjs/swagger';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';

export class PayloadSuccessDto<T = any> {
    @ApiProperty()
    description: string;
    @ApiProperty()
    data?: T;
    @ApiProperty()
    meta?: IPaginationMeta;
    @ApiProperty()
    links?: IPaginationLinks;

    constructor(
        description?: string,
        data?: T,
        meta?: IPaginationMeta,
        links?: IPaginationLinks,
    ) {
        this.description = description;
        this.data = data;
        this.meta = meta;
        this.links = links;
    }
}
