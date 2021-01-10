import { IsString, IsUUID } from 'class-validator';

export class RetrievePostIdParamDto {
    @IsUUID()
    readonly groupId!: string;

    @IsString()
    readonly id!: string;
}
