import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import * as _ from 'lodash';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: NotFoundException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus();
        const r = <any>exception.getResponse();

        const responsePayload = {
            success: false,
            description: _.capitalize(_.lowerCase(r.message.split('.')[1])),
            errorType: r.message,
            timestamp: new Date().toISOString(),
        };

        response.status(statusCode).json(responsePayload);
    }
}
