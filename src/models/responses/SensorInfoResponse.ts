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
        
        // Parse mompow field with power state consideration
        const rawMompow = DaikinDataParser.resolveInteger(dict, 'mompow');
        const powerState = DaikinDataParser.resolveInteger(dict, 'pow');
        
        if (typeof rawMompow === 'number') {
            // If power state is 0 (AC is off), set mompow to 0 regardless of raw value
            if (powerState === 0) {
                result.mompow = 0;
            } else {
                // Convert mompow from 0.1kW units to Watts by multiplying by 100
                result.mompow = rawMompow * 100;
            }
        } else {
            result.mompow = undefined;
        }
        
        cb(null, 'OK', result);
    }
}
