import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
    @IsUUID()
    id: string;

    @IsUUID()
    roomId: string;

    @IsString()
    text: string;
}
