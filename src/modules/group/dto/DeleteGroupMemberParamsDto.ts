import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class DeleteGroupMemberParamsDto {
    @IsUUID()
    groupId: string;

    @IsOptional()
    @IsUUID()
    @Transform((value) => (value === ',' ? null : value))
    profileId: string;
}
