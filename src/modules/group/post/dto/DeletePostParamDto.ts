import { IsString, IsUUID } from 'class-validator';

export class DeletePostParamDto {
    @IsUUID()
    readonly groupId!: string;

    @IsString()
    readonly id: string;
}
