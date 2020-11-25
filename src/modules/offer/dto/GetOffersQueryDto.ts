import { IsDateString, IsOptional } from 'class-validator';

export class GetOffersQueryDto {
    @IsOptional()
    @IsDateString()
    updatedAt: string;
}
