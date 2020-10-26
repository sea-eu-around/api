import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetProfileQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    id?: string;
}
