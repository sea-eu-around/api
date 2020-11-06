import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddOfferToProfileDto {
    @ApiProperty()
    @IsString()
    offerId: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    allowStaff: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    allowStudent: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    allowMale: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    allowFemale: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    allowOther: boolean;
}
