import { IsUUID } from 'class-validator';

export class CreateGroupPostParamDto {
    @IsUUID()
    readonly groupId!: string;
}
