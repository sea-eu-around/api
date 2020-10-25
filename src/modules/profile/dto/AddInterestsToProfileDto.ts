import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AddInterestsToProfileDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    interests: string[];
}
