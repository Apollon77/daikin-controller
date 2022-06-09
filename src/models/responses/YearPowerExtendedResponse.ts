import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { DaikinResponseCb } from '../../DaikinACRequest';

export class YearPowerExtendedResponse {
    public heatCurrentYear?: number[];
    public heatPreviousYear?: number[];
    public coolCurrentYear?: number[];
    public coolPreviousYear?: number[];

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<YearPowerExtendedResponse>): void {
        const result = new YearPowerExtendedResponse();
        result.heatCurrentYear = DaikinDataParser.resolveNumberArr(dict, 'curr_year_heat');
        result.heatPreviousYear = DaikinDataParser.resolveNumberArr(dict, 'prev_year_heat');
        result.coolCurrentYear = DaikinDataParser.resolveNumberArr(dict, 'curr_year_cool');
        result.coolPreviousYear = DaikinDataParser.resolveNumberArr(dict, 'prev_year_cool');
        cb(null, 'OK', result);
    }
}
