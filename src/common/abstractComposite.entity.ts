'use strict';

import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { UtilsService } from '../providers/utils.service';
import { AbstractCompositeDto } from './dto/AbstractCompositeDto';

export abstract class AbstractCompositeEntity<
    T extends AbstractCompositeDto = AbstractCompositeDto
> {
    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    updatedAt: Date;

    abstract dtoClass: new (
        entity: AbstractCompositeEntity,
        options?: any,
    ) => T;

    toDto(options?: any) {
        return UtilsService.toDto(this.dtoClass, this, options);
    }
}