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
            success: false,
            description: r.message,
            errorType: `error.${_.snakeCase(r.message)}`,
            timestamp: new Date().toISOString(),
        });
    }
}
