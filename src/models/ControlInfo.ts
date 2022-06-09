import { DaikinDataParser, ResponseDict } from '../DaikinDataParser';
import { DaikinResponseCb } from '../DaikinACRequest';
import { FanDirection, Power, SpecialModeResponse, Mode, FanRate } from '../DaikinACTypes';
import { RequestDict } from './requests';

const AlternativeHumidityTarget: { [key: string]: 'AUTO' } = {
    AUTO: 'AUTO',
};
const AlternativeTemperatureTargets: { [key: string]: 'M' } = {
    M: 'M',
};

export class ControlInfo {
    public power?: boolean;
    public mode?: number;
    public targetTemperature?: number | 'M';
    public targetHumidity?: number | 'AUTO';
    public fanRate?: number | 'A' | 'B';
    public fanDirection?: number;
    public specialMode?: string;
    public targetTemperatureMode1?: number | 'M';
    public targetTemperatureMode2?: number | 'M';
    public targetTemperatureMode3?: number | 'M';
    public targetTemperatureMode4?: number | 'M';
    public targetTemperatureMode5?: number | 'M';
    public targetTemperatureMode7?: number | 'M';
    public targetHumidityMode1?: number | 'AUTO';
    public targetHumidityMode2?: number | 'AUTO';
    public targetHumidityMode3?: number | 'AUTO';
    public targetHumidityMode4?: number | 'AUTO';
    public targetHumidityMode5?: number | 'AUTO';
    public targetHumidityMode7?: number | 'AUTO';
    public targetHumidityModeH?: number | 'AUTO';
    public fanRateMode1?: number | 'A' | 'B';
    public fanRateMode2?: number | 'A' | 'B';
    public fanRateMode3?: number | 'A' | 'B';
    public fanRateMode4?: number | 'A' | 'B';
    public fanRateMode5?: number | 'A' | 'B';
    public fanRateMode6?: number | 'A' | 'B';
    public fanRateMode7?: number | 'A' | 'B';
    public fanRateModeH?: number | 'A' | 'B';
    public fanDirectionMode1?: number;
    public fanDirectionMode2?: number;
    public fanDirectionMode3?: number;
    public fanDirectionMode4?: number;
    public fanDirectionMode5?: number;
    public fanDirectionMode6?: number;
    public fanDirectionMode7?: number;
    public fanDirectionModeH?: number;
    public modeB?: number;
    public targetTemperatureB?: number | 'M';
    public targetHumidityB?: number | 'AUTO';
    public fanRateB?: number | 'A' | 'B';
    public fanDirectionB?: number;
    public error?: number;

    public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<ControlInfo>): void {
        const result = new ControlInfo();
        result.power = DaikinDataParser.resolveBool(dict, 'pow', Power);
        result.mode = DaikinDataParser.resolveInteger(dict, 'mode', Mode);
        result.targetTemperature = DaikinDataParser.resolveFloat(dict, 'stemp', AlternativeTemperatureTargets);
        result.targetHumidity = DaikinDataParser.resolveFloat(dict, 'shum', AlternativeHumidityTarget);
        result.fanRate = DaikinDataParser.resolveInteger(dict, 'f_rate', FanRate);
        result.fanDirection = DaikinDataParser.resolveInteger(dict, 'f_dir', FanDirection);
        result.specialMode = DaikinDataParser.resolveString(dict, 'adv', SpecialModeResponse);
        result.targetTemperatureMode1 = DaikinDataParser.resolveFloat(dict, 'dt1', AlternativeTemperatureTargets);
        result.targetTemperatureMode2 = DaikinDataParser.resolveFloat(dict, 'dt2', AlternativeTemperatureTargets);
        result.targetTemperatureMode3 = DaikinDataParser.resolveFloat(dict, 'dt3', AlternativeTemperatureTargets);
        result.targetTemperatureMode4 = DaikinDataParser.resolveFloat(dict, 'dt4', AlternativeTemperatureTargets);
        result.targetTemperatureMode5 = DaikinDataParser.resolveFloat(dict, 'dt5', AlternativeTemperatureTargets);
        result.targetTemperatureMode7 = DaikinDataParser.resolveFloat(dict, 'dt7', AlternativeTemperatureTargets);
        result.targetHumidityMode1 = DaikinDataParser.resolveFloat(dict, 'dh1', AlternativeHumidityTarget);
        result.targetHumidityMode2 = DaikinDataParser.resolveFloat(dict, 'dh2', AlternativeHumidityTarget);
        result.targetHumidityMode3 = DaikinDataParser.resolveFloat(dict, 'dh3', AlternativeHumidityTarget);
        result.targetHumidityMode4 = DaikinDataParser.resolveFloat(dict, 'dh4', AlternativeHumidityTarget);
        result.targetHumidityMode5 = DaikinDataParser.resolveFloat(dict, 'dh5', AlternativeHumidityTarget);
        result.targetHumidityMode7 = DaikinDataParser.resolveFloat(dict, 'dh7', AlternativeHumidityTarget);
        result.targetHumidityModeH = DaikinDataParser.resolveFloat(dict, 'dhh', AlternativeHumidityTarget);
        result.fanRateMode1 = DaikinDataParser.resolveInteger(dict, 'dfr1', FanRate);
        result.fanRateMode2 = DaikinDataParser.resolveInteger(dict, 'dfr2', FanRate);
        result.fanRateMode3 = DaikinDataParser.resolveInteger(dict, 'dfr3', FanRate);
        result.fanRateMode4 = DaikinDataParser.resolveInteger(dict, 'dfr4', FanRate);
        result.fanRateMode5 = DaikinDataParser.resolveInteger(dict, 'dfr5', FanRate);
        result.fanRateMode6 = DaikinDataParser.resolveInteger(dict, 'dfr6', FanRate);
        result.fanRateMode7 = DaikinDataParser.resolveInteger(dict, 'dfr7', FanRate);
        result.fanRateModeH = DaikinDataParser.resolveInteger(dict, 'dfrh', FanRate);
        result.fanDirectionMode1 = DaikinDataParser.resolveInteger(dict, 'dfd1', FanDirection);
        result.fanDirectionMode2 = DaikinDataParser.resolveInteger(dict, 'dfd2', FanDirection);
        result.fanDirectionMode3 = DaikinDataParser.resolveInteger(dict, 'dfd3', FanDirection);
        result.fanDirectionMode4 = DaikinDataParser.resolveInteger(dict, 'dfd4', FanDirection);
        result.fanDirectionMode5 = DaikinDataParser.resolveInteger(dict, 'dfd5', FanDirection);
        result.fanDirectionMode6 = DaikinDataParser.resolveInteger(dict, 'dfd6', FanDirection);
        result.fanDirectionMode7 = DaikinDataParser.resolveInteger(dict, 'dfd7', FanDirection);
        result.fanDirectionModeH = DaikinDataParser.resolveInteger(dict, 'dfdh', FanDirection);
        result.modeB = DaikinDataParser.resolveInteger(dict, 'b_mode', Mode);
        result.targetTemperatureB = DaikinDataParser.resolveFloat(dict, 'b_stemp', AlternativeTemperatureTargets);
        result.targetHumidityB = DaikinDataParser.resolveFloat(dict, 'b_shum', AlternativeHumidityTarget);
        result.fanRateB = DaikinDataParser.resolveInteger(dict, 'b_f_rate', FanRate);
        result.fanDirectionB = DaikinDataParser.resolveInteger(dict, 'b_f_dir', FanDirection);
        result.error = DaikinDataParser.resolveInteger(dict, 'alert');
        cb(null, 'OK', result);
    }

    public overwrite(obj: ControlInfo) {
        if (obj.power !== undefined) this.power = obj.power;
        if (obj.mode !== undefined) this.mode = obj.mode;
        if (obj.targetTemperature !== undefined) this.targetTemperature = obj.targetTemperature;
        if (obj.targetHumidity !== undefined) this.targetHumidity = obj.targetHumidity;
        if (obj.fanRate !== undefined) this.fanRate = obj.fanRate;
        if (obj.fanDirection !== undefined) this.fanDirection = obj.fanDirection;
        if (obj.specialMode !== undefined) this.specialMode = obj.specialMode;
        if (obj.targetTemperatureMode1 !== undefined) this.targetTemperatureMode1 = obj.targetTemperatureMode1;
        if (obj.targetTemperatureMode2 !== undefined) this.targetTemperatureMode2 = obj.targetTemperatureMode2;
        if (obj.targetTemperatureMode3 !== undefined) this.targetTemperatureMode3 = obj.targetTemperatureMode3;
        if (obj.targetTemperatureMode4 !== undefined) this.targetTemperatureMode4 = obj.targetTemperatureMode4;
        if (obj.targetTemperatureMode5 !== undefined) this.targetTemperatureMode5 = obj.targetTemperatureMode5;
        if (obj.targetTemperatureMode7 !== undefined) this.targetTemperatureMode7 = obj.targetTemperatureMode7;
        if (obj.targetHumidityMode1 !== undefined) this.targetHumidityMode1 = obj.targetHumidityMode1;
        if (obj.targetHumidityMode2 !== undefined) this.targetHumidityMode2 = obj.targetHumidityMode2;
        if (obj.targetHumidityMode3 !== undefined) this.targetHumidityMode3 = obj.targetHumidityMode3;
        if (obj.targetHumidityMode4 !== undefined) this.targetHumidityMode4 = obj.targetHumidityMode4;
        if (obj.targetHumidityMode5 !== undefined) this.targetHumidityMode5 = obj.targetHumidityMode5;
        if (obj.targetHumidityMode7 !== undefined) this.targetHumidityMode7 = obj.targetHumidityMode7;
        if (obj.targetHumidityModeH !== undefined) this.targetHumidityModeH = obj.targetHumidityModeH;
        if (obj.fanRateMode1 !== undefined) this.fanRateMode1 = obj.fanRateMode1;
        if (obj.fanRateMode2 !== undefined) this.fanRateMode2 = obj.fanRateMode2;
        if (obj.fanRateMode3 !== undefined) this.fanRateMode3 = obj.fanRateMode3;
        if (obj.fanRateMode4 !== undefined) this.fanRateMode4 = obj.fanRateMode4;
        if (obj.fanRateMode5 !== undefined) this.fanRateMode5 = obj.fanRateMode5;
        if (obj.fanRateMode6 !== undefined) this.fanRateMode6 = obj.fanRateMode6;
        if (obj.fanRateMode7 !== undefined) this.fanRateMode7 = obj.fanRateMode7;
        if (obj.fanRateModeH !== undefined) this.fanRateModeH = obj.fanRateModeH;
        if (obj.fanDirectionMode1 !== undefined) this.fanDirectionMode1 = obj.fanDirectionMode1;
        if (obj.fanDirectionMode2 !== undefined) this.fanDirectionMode2 = obj.fanDirectionMode2;
        if (obj.fanDirectionMode3 !== undefined) this.fanDirectionMode3 = obj.fanDirectionMode3;
        if (obj.fanDirectionMode4 !== undefined) this.fanDirectionMode4 = obj.fanDirectionMode4;
        if (obj.fanDirectionMode5 !== undefined) this.fanDirectionMode5 = obj.fanDirectionMode5;
        if (obj.fanDirectionMode6 !== undefined) this.fanDirectionMode6 = obj.fanDirectionMode6;
        if (obj.fanDirectionMode7 !== undefined) this.fanDirectionMode7 = obj.fanDirectionMode7;
        if (obj.fanDirectionModeH !== undefined) this.fanDirectionModeH = obj.fanDirectionModeH;
        if (obj.modeB !== undefined) this.modeB = obj.modeB;
        if (obj.targetTemperatureB !== undefined) this.targetTemperatureB = obj.targetTemperatureB;
        if (obj.targetHumidityB !== undefined) this.targetHumidityB = obj.targetHumidityB;
        if (obj.fanRateB !== undefined) this.fanRateB = obj.fanRateB;
        if (obj.fanDirectionB !== undefined) this.fanDirectionB = obj.fanDirectionB;
        if (obj.error !== undefined) this.error = obj.error;
    }

    public getRequestDict(): RequestDict {
        const dict: RequestDict = {};
        if (this.power === undefined) throw new Error('Required Field power do not exists');
        if (this.mode === undefined) throw new Error('Required Field mode do not exists');
        if (this.targetTemperature === undefined) throw new Error('Required Field targetTemperature do not exists');
        if (this.targetHumidity === undefined) throw new Error('Required Field targetHumidity do not exists');

        dict['pow'] = this.power ? 1 : 0;
        dict['mode'] = this.mode;
        dict['stemp'] =
            typeof this.targetTemperature === 'number'
                ? (Math.round(this.targetTemperature * 2) / 2).toFixed(1)
                : this.targetTemperature;

        dict['shum'] = this.targetHumidity;
        if (this.fanRate !== undefined) dict['f_rate'] = this.fanRate;
        if (this.fanDirection !== undefined) dict['f_dir'] = this.fanDirection;
        if (this.specialMode !== undefined) dict['adv'] = this.specialMode;
        if (this.targetTemperatureMode1 !== undefined) dict['dt1'] = this.targetTemperatureMode1;
        if (this.targetTemperatureMode2 !== undefined) dict['dt2'] = this.targetTemperatureMode2;
        if (this.targetTemperatureMode3 !== undefined) dict['dt3'] = this.targetTemperatureMode3;
        if (this.targetTemperatureMode4 !== undefined) dict['dt4'] = this.targetTemperatureMode4;
        if (this.targetTemperatureMode5 !== undefined) dict['dt5'] = this.targetTemperatureMode5;
        if (this.targetTemperatureMode7 !== undefined) dict['dt7'] = this.targetTemperatureMode7;
        if (this.targetHumidityMode1 !== undefined) dict['dh1'] = this.targetHumidityMode1;
        if (this.targetHumidityMode2 !== undefined) dict['dh2'] = this.targetHumidityMode2;
        if (this.targetHumidityMode3 !== undefined) dict['dh3'] = this.targetHumidityMode3;
        if (this.targetHumidityMode4 !== undefined) dict['dh4'] = this.targetHumidityMode4;
        if (this.targetHumidityMode5 !== undefined) dict['dh5'] = this.targetHumidityMode5;
        if (this.targetHumidityMode7 !== undefined) dict['dh7'] = this.targetHumidityMode7;
        if (this.targetHumidityModeH !== undefined) dict['dhh'] = this.targetHumidityModeH;
        if (this.fanRateMode1 !== undefined) dict['dfr1'] = this.fanRateMode1;
        if (this.fanRateMode2 !== undefined) dict['dfr2'] = this.fanRateMode2;
        if (this.fanRateMode3 !== undefined) dict['dfr3'] = this.fanRateMode3;
        if (this.fanRateMode4 !== undefined) dict['dfr4'] = this.fanRateMode4;
        if (this.fanRateMode5 !== undefined) dict['dfr5'] = this.fanRateMode5;
        if (this.fanRateMode6 !== undefined) dict['dfr6'] = this.fanRateMode6;
        if (this.fanRateMode7 !== undefined) dict['dfr7'] = this.fanRateMode7;
        if (this.fanRateModeH !== undefined) dict['dfrh'] = this.fanRateModeH;
        if (this.fanDirectionMode1 !== undefined) dict['dfd1'] = this.fanDirectionMode1;
        if (this.fanDirectionMode2 !== undefined) dict['dfd2'] = this.fanDirectionMode2;
        if (this.fanDirectionMode3 !== undefined) dict['dfd3'] = this.fanDirectionMode3;
        if (this.fanDirectionMode4 !== undefined) dict['dfd4'] = this.fanDirectionMode4;
        if (this.fanDirectionMode5 !== undefined) dict['dfd5'] = this.fanDirectionMode5;
        if (this.fanDirectionMode6 !== undefined) dict['dfd6'] = this.fanDirectionMode6;
        if (this.fanDirectionMode7 !== undefined) dict['dfd7'] = this.fanDirectionMode7;
        if (this.fanDirectionModeH !== undefined) dict['dfdh'] = this.fanDirectionModeH;
        if (this.modeB !== undefined) dict['b_mode'] = this.modeB;
        if (this.targetTemperatureB !== undefined) dict['b_stemp'] = this.targetTemperatureB;
        if (this.targetHumidityB !== undefined) dict['b_shum'] = this.targetHumidityB;
        if (this.fanRateB !== undefined) dict['b_f_rate'] = this.fanRateB;
        if (this.fanDirectionB !== undefined) dict['b_f_dir'] = this.fanDirectionB;
        if (this.error !== undefined) dict['alert'] = this.error;
        return dict;
    }
}
