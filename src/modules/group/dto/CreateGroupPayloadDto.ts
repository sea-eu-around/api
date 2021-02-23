import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateGroupPayloadDto {
    @ApiProperty()
    @IsString()
    readonly name!: string;

    @ApiProperty()
    @IsBoolean()
    readonly visible!: boolean;

    @ApiProperty()
    @IsBoolean()
    readonly requiresApproval!: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly description?: string;
}
