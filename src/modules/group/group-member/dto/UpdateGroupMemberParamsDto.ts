import { IsUUID } from 'class-validator';

export class UpdateGroupMemberParamsDto {
    @IsUUID()
    readonly groupId!: string;

    @IsUUID()
    readonly profileId!: string;
}
