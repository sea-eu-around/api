import { IsUUID } from 'class-validator';

export class CreateGroupMemberParamsDto {
    @IsUUID()
    groupId: string;
}
