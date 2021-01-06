import { IsUUID } from 'class-validator';

export class DeleteGroupParamsDto {
    @IsUUID()
    readonly id!: string;
}
