'use strict';

import { ForbiddenException } from '@nestjs/common';

export class UserNotVerifiedException extends ForbiddenException {
    constructor(error?: string) {
        super('error.user_not_verified', error);
    }
}
