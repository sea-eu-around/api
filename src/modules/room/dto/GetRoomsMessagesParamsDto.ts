import { IsUUID } from 'class-validator';

export class GetRoomsMessagesParamsDto {
    @IsUUID()
    id: string;
}
