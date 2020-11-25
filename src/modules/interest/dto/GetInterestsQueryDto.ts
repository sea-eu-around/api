import { IsDateString, IsOptional } from 'class-validator';

export class GetInterestsQueryDto {
    @IsOptional()
    @IsDateString()
    date: string;
}
