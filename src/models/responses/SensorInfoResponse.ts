import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { DaikinResponseCb } from '../../DaikinACRequest';

export class SensorInfoResponse {
    public indoorTemperature?: number;
    public indoorHumidity?: number;
    public outdoorTemperature?: number;
    public error?: number;
    public cmpfreq?: number;

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<SensorInfoResponse>): void {
        const result = new SensorInfoResponse();
        result.indoorTemperature = DaikinDataParser.resolveFloat(dict, 'htemp');
        result.indoorHumidity = DaikinDataParser.resolveFloat(dict, 'hhum');
        result.outdoorTemperature = DaikinDataParser.resolveFloat(dict, 'otemp');
        result.error = DaikinDataParser.resolveInteger(dict, 'err');
        result.cmpfreq = DaikinDataParser.resolveInteger(dict, 'cmpfreq');
        cb(null, 'OK', result);
    }
}
