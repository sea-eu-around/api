import { IsUUID } from 'class-validator';

export class UpdateGroupParamsDto {
    @IsUUID()
    readonly id!: string;
}
