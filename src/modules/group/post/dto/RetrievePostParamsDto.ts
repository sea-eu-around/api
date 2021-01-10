import { IsUUID } from 'class-validator';

export class RetrievePostParamsDto {
    @IsUUID()
    readonly groupId!: string;
}
