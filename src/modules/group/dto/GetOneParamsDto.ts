import { IsUUID } from 'class-validator';

export class GetOneGroupParamsDto {
    @IsUUID()
    id: string;
}
