import { IsUUID } from 'class-validator';

export class RetrieveGroupPostParamsDto {
    @IsUUID()
    readonly groupId!: string;
}
