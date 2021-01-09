import { IsUUID } from 'class-validator';

export class CreatePostParamsDto {
    @IsUUID()
    readonly groupId!: string;
}
