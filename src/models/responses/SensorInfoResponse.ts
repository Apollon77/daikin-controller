import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { DaikinResponseCb } from '../../DaikinACRequest';

// Devices report '-' for sensor readings they cannot provide; that parses to NaN.
function resolveSensorReading(dict: ResponseDict, key: string): number | undefined {
    const value = DaikinDataParser.resolveFloat<number>(dict, key);
    return typeof value === 'number' && Number.isNaN(value) ? undefined : value;
}

export class SensorInfoResponse {
    public indoorTemperature?: number;
    public indoorHumidity?: number;
    public outdoorTemperature?: number;
    public error?: number;
    public cmpfreq?: number;

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<SensorInfoResponse>): void {
        const result = new SensorInfoResponse();
        result.indoorTemperature = resolveSensorReading(dict, 'htemp');
        result.indoorHumidity = resolveSensorReading(dict, 'hhum');
        result.outdoorTemperature = resolveSensorReading(dict, 'otemp');
        result.error = DaikinDataParser.resolveInteger(dict, 'err');
        result.cmpfreq = DaikinDataParser.resolveInteger(dict, 'cmpfreq');
        cb(null, 'OK', result);
    }
}
