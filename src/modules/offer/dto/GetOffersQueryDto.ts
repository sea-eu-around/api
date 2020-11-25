import { IsDateString, IsOptional } from 'class-validator';

export class GetOffersQueryDto {
    @IsOptional()
    @IsDateString()
    date: string;
}
