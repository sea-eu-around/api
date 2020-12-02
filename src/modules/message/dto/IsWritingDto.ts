import { IsUUID } from 'class-validator';

export class IsWritingDto {
    @IsUUID()
    roomId: string;
}
