import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { DaikinResponseCb } from '../../DaikinACRequest';

export class SensorInfoResponse {
    public indoorTemperature?: number;
    public indoorHumidity?: number;
    public outdoorTemperature?: number;
    public error?: number;
    public cmpfreq?: number;
    public mompow?: number;

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<SensorInfoResponse>): void {
        const result = new SensorInfoResponse();
        result.indoorTemperature = DaikinDataParser.resolveFloat(dict, 'htemp');
        result.indoorHumidity = DaikinDataParser.resolveFloat(dict, 'hhum');
        result.outdoorTemperature = DaikinDataParser.resolveFloat(dict, 'otemp');
        result.error = DaikinDataParser.resolveInteger(dict, 'err');
        result.cmpfreq = DaikinDataParser.resolveInteger(dict, 'cmpfreq');
        // Convert mompow from 0.1kW units to Watts by multiplying by 100
        const rawMompow = DaikinDataParser.resolveInteger(dict, 'mompow');
        result.mompow = typeof rawMompow === 'number' ? rawMompow * 100 : undefined;
        cb(null, 'OK', result);
    }
}
