import { IsBoolean, IsUUID } from 'class-validator';

export class IsWritingDto {
    @IsUUID()
    roomId: string;

    @IsBoolean()
    state: boolean;
}
