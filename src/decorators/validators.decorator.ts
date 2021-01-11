/* tslint:disable:naming-convention */
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { UtilsService } from '../providers/utils.service';
import { WhitelistedEmailRepository } from '../repositories/whitelistedEmail.repository';

@ValidatorConstraint({ name: 'isSEAEmailConstraint', async: true })
@Injectable()
export class IsSEAEmailConstraint implements ValidatorConstraintInterface {
    constructor(
        private readonly _whitelistedEmailRepository: WhitelistedEmailRepository,
    ) {}

    async validate(
        value: string,
        _args: ValidationArguments,
    ): Promise<boolean> {
        const whitelistedEmails = await this._whitelistedEmailRepository.find();
        // Whitelist
        if (whitelistedEmails.map((x) => x.email).includes(value)) {
            return true;
        }

        const university = UtilsService.extractUnivFromEmail({ email: value });

        if (university) {
            return true;
        }
        return false;
    }
}

export function IsSEAEmail(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isSEAEmail',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: IsSEAEmailConstraint,
        });
    };
}
