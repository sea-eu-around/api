import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateGroupPayloadDto {
    @ApiProperty()
    @IsString()
    readonly name!: string;

    @ApiProperty()
    @IsBoolean()
    readonly visible!: boolean;

    @ApiProperty()
    @IsBoolean()
    readonly requireApproval!: boolean;
}
