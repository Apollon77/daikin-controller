import { DaikinDataParser, ResponseDict } from '../DaikinDataParser';
import { DaikinResponseCb } from '../DaikinACRequest';

export class DemandControl {
    public enabled?: boolean;
    public mode?: number;
    public maxPower?: number;

    // ret=OK,type=1,en_demand=1,mode=0,max_pow=55,scdl_per_day=4,moc=0,tuc=0,wec=0,thc=0,frc=0,sac=0,suc=0
    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<DemandControl>): void {
        const result = new DemandControl();
        result.enabled = DaikinDataParser.resolveBool(dict, 'en_demand');
        result.mode = DaikinDataParser.resolveInteger(dict, 'mode');
        result.maxPower = DaikinDataParser.resolveInteger(dict, 'max_pow');
        cb(null, 'OK', result);
    }
}
