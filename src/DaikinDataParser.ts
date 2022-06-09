import { DaikinResponseCb } from './DaikinACRequest';

export type ResponseDict = { [key: string]: string | number };

export class DaikinDataParser {
    public static processResponse<T>(
        inputData: Error | string | Buffer,
        callback?: DaikinResponseCb<T>,
    ): ResponseDict | null {
        if (inputData instanceof Error) {
            callback?.(new Error(`Error occured: ${(inputData as Error).message}`), null, null);
            return null;
        }
        if (Buffer.isBuffer(inputData)) {
            inputData = inputData.toString();
        }
        const input: string = inputData as string;

        if (!input.includes('=')) {
            callback?.(new Error('Cannot parse response: ' + input), null, null);
            return null;
        }
        const dict = this.responseToDict(input);
        const ret = dict['ret'];
        switch (ret) {
            case 'OK':
                delete dict['ret'];
                break;
            case 'PARAM NG':
                callback?.(new Error('Wrong Parameters in request: ' + input), ret, null);
                return null;
            case 'ADV NG':
                callback?.(new Error('Wrong ADV: ' + input), ret, null);
                return null;
            default:
                callback?.(new Error('Unknown response: ' + input), ret, null);
                return null;
        }
        return dict;
    }

    public static responseToDict(s: string): ResponseDict {
        const regex = /(?:^|,)([a-zA-Z0-9_]+)=(.*?)(?=$|,([a-zA-Z0-9_]+)=)/g;
        let match;
        const result: ResponseDict = {};
        while ((match = regex.exec(s))) {
            result[match[1]] = match[2];
        }
        return result;
    }

    public static resolveString(
        dict: ResponseDict,
        key: string,
        altValues?: { [key: string]: string },
    ): string | undefined {
        const value: undefined | string | number = dict[key];
        if (value === undefined) {
            return undefined;
        }

        if (altValues !== undefined) {
            for (const key in altValues) {
                if (altValues[key] === value) return value;
            }
        }

        return typeof value === 'number' ? value.toString() : value;
    }

    public static resolveBool(
        dict: ResponseDict,
        key: string,
        altValues?: { [key: string]: boolean },
    ): boolean | undefined {
        const value: undefined | string | number = dict[key];
        if (value === undefined) {
            return undefined;
        }
        if (altValues?.[value] !== undefined) {
            return altValues[value];
        }
        return !!(typeof value !== 'number' ? parseInt(value as string, 10) : value);
    }

    public static resolveInteger<T>(
        dict: ResponseDict,
        key: string,
        altValues?: { [key: string]: number | T },
    ): number | undefined | T {
        const value: undefined | string | number = dict[key];
        if (value === undefined) {
            return undefined;
        }

        if (altValues !== undefined) {
            for (const key in altValues) {
                if (altValues[key] === value) return value;
            }
        }
        return typeof value !== 'number' ? parseInt(value as string, 10) : value;
    }

    public static resolveFloat<T>(
        dict: ResponseDict,
        key: string,
        altValues?: { [key: string]: number | T },
    ): number | undefined | T {
        const value: undefined | string | number = dict[key];
        if (value === undefined) {
            return undefined;
        }

        if (altValues !== undefined) {
            if (altValues[value] !== undefined) return altValues[value];
            for (const key in altValues) {
                if (altValues[key] === value) return value;
            }
        }
        return typeof value !== 'number' ? parseFloat(value as string) : value;
    }

    public static resolveNumberArr(dict: ResponseDict, key: string): number[] | undefined {
        const value: undefined | string | number = dict[key];
        if (value === undefined) {
            return undefined;
        }
        const dataArr = (value as string).split('/');
        const arr: number[] = [];
        for (let i = 0; i < dataArr.length; i++) {
            arr[i] = parseInt(dataArr[i], 10);
        }
        return arr;
    }
}
