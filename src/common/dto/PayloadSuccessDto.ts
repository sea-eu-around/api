import { ApiProperty } from '@nestjs/swagger';

export class PayloadSuccessDto<T = any> {
    @ApiProperty()
    description: string;
    @ApiProperty()
    data?: T;

    constructor(description?: string, data?: T) {
        this.description = description;
        this.data = data;
    }
}
