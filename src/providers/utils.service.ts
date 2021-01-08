import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import * as _ from 'lodash';

import { AbstractEntity } from '../common/abstract.entity';
import { AbstractCompositeEntity } from '../common/abstractComposite.entity';
import {
    PARTNER_UNIVERSITIES,
    PartnerUniversity,
} from '../common/constants/sea';

export class UtilsService {
    /**
     * convert entity to dto class instance
     * @param {{new(entity: E, options: any): T}} model
     * @param {E[] | E} entity
     * @param options
     * @returns {T[] | T}
     */

    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E | E[],
        options?: any,
    ): T | T[] {
        if (_.isArray(entity)) {
            return entity.map((u) => new model(u, options));
        }

        return new model(entity, options);
    }

    public static isDto = (obj) => {
        if (obj && obj.dtoClass) {
            return true;
        }
        return false;
    };

    public static isDtos = (arr) => {
        if (arr) {
            return arr.every(UtilsService.isDto);
        }
        return false;
    };

    public static isEntity = (obj) => {
        if (
            obj &&
            (obj instanceof AbstractEntity ||
                obj instanceof AbstractCompositeEntity)
        ) {
            return true;
        }
        return false;
    };

    public static isEntities = (arr) => {
        if (arr && _.isArray(arr)) {
            return arr.every(UtilsService.isEntity);
        }
        return false;
    };

    /**
     * generate hash from password or string
     * @param {string} password
     * @returns {string}
     */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * generate random string
     * @param length
     */
    static generateRandomString(length: number): string {
        return Math.random()
            .toString(36)
            .replace(/[^a-zA-Z0-9]+/g, '')
            .substr(0, length);
    }
    /**
     * validate text with hash
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>}
     */
    static validateHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash || '');
    }

    static isImageFilename(filename: string): boolean {
        const regex = RegExp(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(png|jpg|jpeg)$/,
        );
        return regex.exec(filename) != null;
    }

    static extractUnivFromEmail({
        email,
    }: {
        email: string;
    }): PartnerUniversity {
        if (!isEmail(email)) {
            throw new Error('email must be an email.');
        }

        const domain = email.split('@')[1];

        const university = PARTNER_UNIVERSITIES.find(
            (currentUniversity) =>
                currentUniversity.domainRegexes.filter(
                    (regex) => regex.exec(domain) !== null,
                ).length > 0,
        );

        if (!university) {
            return null;
        }

        return <PartnerUniversity>university.key;
    }
}
