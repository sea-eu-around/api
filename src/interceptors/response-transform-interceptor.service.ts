/* eslint-disable @typescript-eslint/tslint/config */
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractEntity } from '../common/abstract.entity';
import { UtilsService } from '../providers/utils.service';

export interface IResponse<T> {
    data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, IResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<IResponse<T>> {
        return next.handle().pipe(
            map(({ description, data, ...rest }) => ({
                success: true,
                description,
                data: UtilsService.isEntity(data)
                    ? <AbstractEntity>data.toDto()
                    : UtilsService.isEntities(data)
                    ? <AbstractEntity[]>data.toDtos()
                    : data,
                ...rest,
            })),
        );
    }
}
