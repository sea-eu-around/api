import { IsUUID } from 'class-validator';

export class RetrieveGroupMembersParamsDto {
    @IsUUID()
    readonly groupId!: string;
}
