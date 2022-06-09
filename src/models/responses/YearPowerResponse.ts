import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { DaikinResponseCb } from '../../DaikinACRequest';

export class YearPowerResponse {
    public previousYear?: number[];
    public currentYear?: number[];

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<YearPowerResponse>): void {
        const result = new YearPowerResponse();
        result.previousYear = DaikinDataParser.resolveNumberArr(dict, 'previous_year');
        result.currentYear = DaikinDataParser.resolveNumberArr(dict, 'this_year');
        cb(null, 'OK', result);
    }
}
