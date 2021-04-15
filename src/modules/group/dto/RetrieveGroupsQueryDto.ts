import { Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator';

import { GroupMemberStatusType } from '../../../common/constants/group-member-status-type';

export class RetrieveGroupsQueryDto {
    @IsInt()
    @Transform(parseInt)
    readonly page!: number;

    @IsInt()
    @Transform(parseInt)
    readonly limit!: number;

    @IsString()
    @IsOptional()
    readonly profileId?: string;

    @IsOptional()
    @IsString()
    readonly search?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(GroupMemberStatusType, { each: true })
    @Transform((value: string) => value.split(','))
    readonly statuses?: GroupMemberStatusType[];

    @IsOptional()
    @IsBoolean()
    @Transform((value) => value === 'true')
    readonly explore?: boolean;
}
