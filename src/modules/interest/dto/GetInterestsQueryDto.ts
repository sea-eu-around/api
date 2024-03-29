import { IsDateString, IsOptional } from 'class-validator';

export class GetInterestsQueryDto {
    @IsOptional()
    @IsDateString()
    updatedAt: string;
}
