/* tslint:disable:naming-convention */
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

import { PARTNER_UNIVERSITIES } from '../common/constants/sea';
import { ConfigService } from '../shared/services/config.service';

export function IsPassword(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, _args: ValidationArguments) {
                    return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);
                },
            },
        });
    };
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
            validator: {
                validate(value: string, _args: ValidationArguments) {
                    const domain = value.split('@')[1];
                    const configService = new ConfigService();
                    if (configService.isProduction) {
                        // Whitelist
                        if (
                            [
                                'contact@biografik.fr',
                                'ladislas.dellinger@imt-atlantique.net',
                                'ladislas14@gmail.com',
                                'ladislas.dellinger@gmail.com',
                                'alfred.pichard@imt-atlantique.net',
                                'kelian.baert@imt-atlantique.net',
                            ].includes(value)
                        ) {
                            return true;
                        }

                        return (
                            PARTNER_UNIVERSITIES.map(
                                (university) => university.domain,
                            ).filter((x) => x === domain).length > 0
                        );
                    }
                    return true;
                },
            },
        });
    };
}
