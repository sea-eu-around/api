import { IsString, IsUUID } from 'class-validator';

export class UpdatePostParamDto {
    @IsUUID()
    readonly groupId!: string;

    @IsString()
    readonly id!: string;
}
