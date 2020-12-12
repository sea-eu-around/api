import { UnauthorizedException } from '@nestjs/common';

export class EmailOrPasswordIncorrectException extends UnauthorizedException {
    constructor(error?: string) {
        super('error.email_or_password_incorrect', error);
    }
}
