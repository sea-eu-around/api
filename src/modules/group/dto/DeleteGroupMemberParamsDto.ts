import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class DeleteGroupMemberParamsDto {
    @IsUUID()
    readonly groupId!: string;

    @IsOptional()
    @IsUUID()
    @Transform((value) => (value === ',' ? null : value))
    readonly profileId?: string;
}
