import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AddInterestToProfileDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    interestIds: string[];
}
