/* tslint:disable:naming-convention */
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { PARTNER_UNIVERSITIES } from '../common/constants/sea';
import { WhitelistedEmailRepository } from '../repositories/whitelistedEmail.repository';
import { ConfigService } from '../shared/services/config.service';

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
        const configService = new ConfigService();
        if (configService.isProduction) {
            const whitelistedEmails = await this._whitelistedEmailRepository.find();
            // Whitelist
            if (whitelistedEmails.map((x) => x.email).includes(value)) {
                return true;
            }

            const domain = value.split('@')[1];

            return (
                PARTNER_UNIVERSITIES.map(
                    (university) => university.domain,
                ).filter((x) => x === domain).length > 0
            );
        }

        return true;
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
