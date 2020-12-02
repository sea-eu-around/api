import { IsUUID } from 'class-validator';

export class ReadMessageDto {
    @IsUUID()
    roomId: string;

    @IsUUID()
    messageId: string;
}
