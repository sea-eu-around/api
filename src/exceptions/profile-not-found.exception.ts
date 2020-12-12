'use strict';

import { NotFoundException } from '@nestjs/common';

export class ProfileNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.profile_not_found', error);
    }
}
