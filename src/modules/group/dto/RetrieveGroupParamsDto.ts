import { IsUUID } from 'class-validator';

export class RetrieveGroupParamsDto {
    @IsUUID()
    readonly id!: string;
}
