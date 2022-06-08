import {DaikinDataParser, ResponseDict} from "../../DaikinDataParser";
import {DaikinResponseCb} from "../../DaikinACRequest";

export class WeekPowerExtendedResponse {
  public sDayw?: number;
  public heatWeek?: number[];
  public coolWeek?: number[];

  public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<WeekPowerExtendedResponse>): void {
    const result = new WeekPowerExtendedResponse();
    result.sDayw = DaikinDataParser.resolveInteger(dict, 's_dayw');
    result.heatWeek = DaikinDataParser.resolveNumberArr(dict, 'week_heat');
    result.coolWeek = DaikinDataParser.resolveNumberArr(dict, 'week_cool');
    cb(null, 'OK', result);
  }
}
