import { ForbiddenException } from '@nestjs/common';

export class UserBeingDeletedException extends ForbiddenException {
    constructor(error?: string) {
        super('error.user_being_deleted', error);
    }
}
