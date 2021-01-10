import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Connection, EntityTarget } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'exists', async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
    private readonly _logger = new Logger(ExistsConstraint.name);

    constructor(@InjectConnection() private readonly _connection: Connection) {}

    // eslint-disable-next-line @typescript-eslint/tslint/config
    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        const [entity, column] = args.constraints;

        const repository = this._connection.getRepository(entity);
        const result = await repository.findOne({ where: { [column]: value } });
        if (result) {
            return true;
        }

        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/tslint/config
export function Exists<Entity>(
    entity: EntityTarget<Entity>,
    column: keyof Entity,
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    /*const injectExistsConstraint = Inject(ExistsConstraint);
    return (target, propertyKey: string) => {
        let value: string;

        const getter = () => value;

        const setter = async (newVal: string) => {
            injectExistsConstraint(target, 'validator');
            const validator: ExistsConstraint = this.validator;

            if (await validator.validate<Entity>(value, entity, column)) {
                value = newVal;
            } else {
                throw new NotFoundException();
            }
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
        });
    };*/

    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'exists',
            target: object.constructor,
            constraints: [entity, column],
            options: validationOptions,
            validator: ExistsConstraint,
        });
    };
}
