'use strict';

import { AbstractCompositeEntity } from '../abstractComposite.entity';

export class AbstractCompositeDto {
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: AbstractCompositeEntity) {
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
