import { IsString } from 'class-validator';

export class RetrieveAvailableMatchesQueryDto {
    @IsString()
    readonly search?: string;
}
