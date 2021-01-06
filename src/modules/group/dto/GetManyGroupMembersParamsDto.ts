import { IsUUID } from 'class-validator';

export class GetManyGroupMembersParamsDto {
    @IsUUID()
    groupId: string;
}
