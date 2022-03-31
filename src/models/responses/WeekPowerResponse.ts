import {DaikinDataParser, ResponseDict} from "../../DaikinDataParser";
import {DaikinResponseCb} from "../../DaikinACRequest";

export class WeekPowerResponse {
  public todayRuntime?: number;
  public data?: number[];

  public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<WeekPowerResponse>): void {
    const result = new WeekPowerResponse();
    result.todayRuntime = DaikinDataParser.resolveInteger(dict, 'today_runtime');
    result.data = DaikinDataParser.resolveNumberArr(dict, 'datas');
    cb(null, 'OK', result);
  }
}
