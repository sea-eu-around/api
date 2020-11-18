import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import * as _ from 'lodash';

import { IValidationError } from '../interfaces/IValidationError';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: UnprocessableEntityException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = exception.getStatus();
        const r = <any>exception.getResponse();

        let errors;
        if (_.isArray(r.message) && r.message[0] instanceof ValidationError) {
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            const validationErrors = <ValidationError[]>r.message;
            errors = this._validationFilter(validationErrors);
        }

        const responsePayload = {
            errors,
            success: false,
            errorType: 'error.unprocessable-entity',
            description: STATUS_CODES[statusCode],
            timestamp: new Date().toISOString(),
        };

        console.error(responsePayload);
        response.status(statusCode).json(responsePayload);
    }

    private _validationFilter(
        validationErrors: ValidationError[],
    ): IValidationError[] {
        const errors: IValidationError[] = [];
        for (const validationError of validationErrors) {
            const error: IValidationError = {
                property: validationError.property,
                codes: [],
            };
            for (const [constraintKey, constraint] of Object.entries(
                validationError.constraints,
            )) {
                error.codes.push({
                    description: _.capitalize(constraint),
                    code: `error.validation.${
                        validationError.property
                    }.${_.snakeCase(constraintKey)}`,
                });
            }
            errors.push(error);
        }
        return errors;
    }
}
