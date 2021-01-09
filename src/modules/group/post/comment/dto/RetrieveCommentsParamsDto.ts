import { IsUUID } from 'class-validator';

export class RetrieveCommentsParamsDto {
    @IsUUID()
    groupId: string;

    @IsUUID()
    postId: string;
}
