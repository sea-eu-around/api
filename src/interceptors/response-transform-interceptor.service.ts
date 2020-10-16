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
            map(({ description, data }) => ({
                success: true,
                description,
                data:
                    data instanceof AbstractEntity
                        ? <AbstractEntity>data.toDto()
                        : data,
            })),
        );
    }
}