import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { GroupMemberStatusType } from '../../../../common/constants/group-member-status-type';

export class GetManyGroupMembersQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform(parseInt)
    readonly limit!: number;

    @IsOptional()
    @IsArray()
    @IsEnum(GroupMemberStatusType, { each: true })
    @Transform((value: string) => value.split(','))
    readonly statuses?: GroupMemberStatusType[];

    @IsOptional()
    @IsString()
    readonly search?: string;
}
