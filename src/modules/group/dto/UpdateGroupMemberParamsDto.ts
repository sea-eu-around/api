import { IsUUID } from 'class-validator';

export class UpdateGroupMemberParamsDto {
    @IsUUID()
    groupId: string;

    @IsUUID()
    profileId: string;
}
