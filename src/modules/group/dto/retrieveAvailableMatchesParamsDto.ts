import { IsUUID } from 'class-validator';

export class RetrieveAvailableMatchesParamsDto {
    @IsUUID()
    readonly id!: string;
}
