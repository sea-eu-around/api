import { IsUUID } from 'class-validator';

export class CreateGroupCoverParamsDto {
    @IsUUID()
    readonly id!: string;
}
