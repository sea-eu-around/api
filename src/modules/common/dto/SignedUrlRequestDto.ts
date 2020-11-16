import { IsNotEmpty, IsString } from 'class-validator';

export class SignedUrlRequestDto {
    @IsString()
    @IsNotEmpty()
    readonly mimeType: string;
}
