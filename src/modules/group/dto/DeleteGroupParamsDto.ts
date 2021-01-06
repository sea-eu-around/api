import { IsUUID } from 'class-validator';

export class DeleteGroupParamsDto {
    @IsUUID()
    id: string;
}
