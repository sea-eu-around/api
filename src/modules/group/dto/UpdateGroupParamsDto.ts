import { IsUUID } from 'class-validator';

export class UpdateGroupParamsDto {
    @IsUUID()
    id: string;
}
