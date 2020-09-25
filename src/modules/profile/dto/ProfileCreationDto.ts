import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export abstract class ProfileCreationDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    university: string;
}
