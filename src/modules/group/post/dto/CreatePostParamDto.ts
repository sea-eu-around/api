import { IsUUID } from 'class-validator';

export class CreatePostParamDto {
    @IsUUID()
    readonly groupId!: string;
}
