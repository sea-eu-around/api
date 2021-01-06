import { IsUUID } from 'class-validator';

export class CreateGroupMemberParamsDto {
    @IsUUID()
    readonly groupId!: string;
}
