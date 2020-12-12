import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import * as _ from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const r = <any>exception.getResponse();

        response.status(status).json({
            description: this._formatDescription(r.message),
            errorType: this._formatErrorType(r.message),
            timestamp: new Date().toISOString(),
        });
    }

    private _formatDescription(message: string): string {
        const dotSplitted = message.split('.');
        if (dotSplitted.length > 0 && dotSplitted[0] === 'error') {
            const description = dotSplitted
                .slice(1)
                .reduce((acc, cur) => _.lowerCase(cur) + ' ' + acc, '');

            return _.trim(_.capitalize(description));
        }

        return message;
    }

    private _formatErrorType(message: string): string {
        const dotSplitted = message.split('.');
        if (dotSplitted.length > 0 && dotSplitted[0] === 'error') {
            return message;
        }

        return `error.${_.snakeCase(message)}`;
    }
}
