import { IsUUID } from 'class-validator';

export class GetRoomParamsDto {
    @IsUUID()
    id: string;
}
