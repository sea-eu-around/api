import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';

import { GroupMemberStatusType } from '../../../common/constants/group-member-status-type';

export class GetManyGroupMembersQueryDto {
    @IsInt()
    @Transform(parseInt)
    page: number;

    @IsInt()
    @Transform(parseInt)
    limit: number;

    @IsOptional()
    @IsArray()
    @IsEnum(GroupMemberStatusType, { each: true })
    @Transform((value: string) => value.split(','))
    statuses?: GroupMemberStatusType[];
}
