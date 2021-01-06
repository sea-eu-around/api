import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGroupPayloadDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    readonly visible?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    readonly requireApproval?: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly description?: string;
}
