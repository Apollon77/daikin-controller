import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { DaikinResponseCb } from '../../DaikinACRequest';
import { SpecialModeResponse } from '../../DaikinACTypes';

export class SetCommandResponse {
    public specialMode?: string;

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<SetCommandResponse>): void {
        const result = new SetCommandResponse();
        result.specialMode = DaikinDataParser.resolveString(dict, 'adv', SpecialModeResponse);
        cb(null, 'OK', result);
    }
}
