import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
    @IsUUID()
    roomId: string;

    @IsString()
    text: string;
}
