import { DaikinDataParser, ResponseDict } from '../DaikinDataParser';
import { DaikinResponseCb } from '../DaikinACRequest';
import { RequestDict } from './requests';

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

    public overwrite(obj: Partial<DemandControl>) {
        if (obj.enabled !== undefined) this.enabled = obj.enabled;
        if (obj.mode !== undefined) this.mode = obj.mode;
        if (obj.maxPower !== undefined) this.maxPower = obj.maxPower;
    }

    // According to https://www.akkudoktor.net/forum/postid/190147/
    public getRequestDict(): RequestDict {
        const dict: RequestDict = {};
        if (this.enabled == undefined) throw new Error('Required Field enabled does not exist');
        dict['lpw'] = ''; // Appeared in all examples but doesn't seem to be necessary
        dict['en_demand'] = this.enabled ? 1 : 0;
        if (!this.enabled) {
            // Switch off demand control
            // http://<DAIKIN-IP>/aircon/set_demand_control?lpw=&en_demand=0
            return dict;
        }

        // Enable and set demand control
        // http://<DAIKIN-IP>/aircon/set_demand_control?lpw=&en_demand=1&mode=0&type=1&max_pow=[40-100]

        // For automatic or manual demand control we need mode, type and maxPower
        if (this.mode === undefined) throw new Error('Required Field mode do not exists');
        if (this.maxPower === undefined) throw new Error('Required Field maxPower do not exists');

        // For now we do support automatic or manual mode only
        if (this.mode !== 0 && this.mode !== 2)
            throw new Error('Currently only automatic(2) or manual mode(0) is supported');

        // maxPower must be modulo 5 and between 40 and 100
        if (this.maxPower < 40 || this.maxPower > 100 || this.maxPower % 5 !== 0)
            throw new Error('maxPower must be between 40 and 100 and a multiply of 5');

        dict['type'] = 1; // must be set to 1
        dict['mode'] = this.mode;
        dict['max_pow'] = this.maxPower;
        return dict;
    }
}
