import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

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

    /**
     * Convert an integer to binary
     * @param {number} dec
     * @returns {string}
     */
    public static decimalToBinary(dec: number): string {
        try {
            if (!Number.isInteger(dec)) {
                throw new Error('dec must be an integer');
            }

            // eslint-disable-next-line no-bitwise
            return (dec >>> 0).toString(2);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Convert an binary to integer
     * @param {string} binary
     * @returns {number}
     */
    public static binaryToDecimal(binary: string): number {
        try {
            return parseInt(binary, 2);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Convert a binary string to array of boolean
     * @param {string} binary
     * @returns {boolean[]}
     */
    public static binaryToArrayBool(binary: string): boolean[] {
        try {
            const binaryToArray = binary.split('').map((x) => parseInt(x, 10));

            if (!binaryToArray.every((x) => x === 0 || x === 1)) {
                throw new Error('binary must be a binary');
            }

            return binaryToArray.map((x) => (x === 0 ? false : true));
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Convert an array of boolean to binary string
     * @param {boolean[]} arrayBool
     * @returns {string}
     */
    public static arrayBoolToBinary(arrayBool: boolean[]): string {
        try {
            return arrayBool.map((x) => (x ? '1' : '0')).join('');
        } catch (e) {
            console.error(e);
        }
    }
}
