import { DaikinDataParser } from './DaikinDataParser';
import {
    BasicInfoResponse,
    ControlInfo,
    ModelInfoResponse,
    RemoteMethodResponse,
    RequestDict,
    SensorInfoResponse,
    WeekPowerExtendedResponse,
    WeekPowerResponse,
    YearPowerExtendedResponse,
    YearPowerResponse,
} from './models';
import { SetCommandResponse, SetSpecialModeRequest } from './models';
import { SpecialModeKind } from './DaikinACTypes';
import { DemandControl } from './models/DemandControl';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RestClient = require('node-rest-client').Client;

export type Logger = null | undefined | ((data: string | null) => void);

export interface SetSpecialModeRequestObject {
    state: 0 | 1 | '0' | '1';
    kind: SpecialModeKind;
}

export interface DaikinACOptions {
    logger?: Logger;
    useGetToPost?: boolean;
}

export type ResponseHandler = (data: Error | string | Buffer, response?: unknown) => void;
export type DaikinResponseCb<T> = (err: Error | null, ret: any | null, daikinResponse: T | null) => void;

export class DaikinACRequest {
    get logger(): Logger | null {
        return this._logger;
    }

    set logger(value: Logger | null) {
        this._logger = value;
    }
    private _logger: Logger | null = null;
    private defaultParameters: { [key: string]: any } = {};
    private readonly useGetToPost: boolean = false;
    private readonly ip: string;
    private restClient: any;

    public constructor(ip: string, options: DaikinACOptions) {
        this.ip = ip;
        if (options.logger !== undefined) {
            this.logger = options.logger;
        }
        if (options.useGetToPost) {
            this.useGetToPost = true;
        }
        this.restClient = new RestClient();
    }

    public addDefaultParameter(key: string, value: any) {
        this.defaultParameters[key] = value;
    }

    public doGet(url: string, parameters: RequestDict, callback: ResponseHandler) {
        const reqParams = Object.assign({}, this.defaultParameters, parameters);

        const data: any = {
            parameters: reqParams,
            headers: {
                'Content-Type': 'text/plain',
                'User-Agent': 'DaikinOnlineController/2.4.2 CFNetwork/978.0.7 Darwin/18.6.0',
                Accept: '*/*',
                'Accept-Language': 'de-de',
                'Accept-Encoding': 'gzip, deflate',
            },
            requestConfig: {
                timeout: 5000, //request timeout in milliseconds
                noDelay: true, //Enable/disable the Nagle algorithm
                keepAlive: false, //Enable/disable keep-alive functionalityidle socket.
                //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
            },
            responseConfig: {
                timeout: 5000, //response timeout
            },
        };
        if (this.logger) this.logger(`Call GET ${url} with ${JSON.stringify(reqParams)}`);
        const req = this.restClient.get(url, data, callback);

        req.on('requestTimeout', (req: XMLHttpRequest) => {
            if (this.logger) this.logger('request timeout');
            req.abort();
            callback(new Error(`Error while communicating with Daikin device: Timeout`));
        });

        req.on('responseTimeout', (_res: any) => {
            if (this.logger) this.logger('response timeout');
        });

        req.on('error', (err: any) => {
            let errMessage: string;
            if (err.code) {
                errMessage = err.code;
            } else if (err.message) {
                errMessage = err.message;
            } else {
                errMessage = err.toString();
            }
            err.message = `Error while communicating with Daikin device: ${errMessage}`;

            callback(err);
        });
    }

    public doPost(url: string, parameters: { [key: string]: any }, callback: ResponseHandler) {
        if (this.useGetToPost) {
            this.doGet(url, parameters, callback);
            return;
        }
        const reqParams = Object.assign({}, this.defaultParameters, parameters);
        const data = {
            data: reqParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'DaikinOnlineController/2.4.2 CFNetwork/978.0.7 Darwin/18.6.0',
                Accept: '*/*',
                'Accept-Language': 'de-de',
                'Accept-Encoding': 'gzip, deflate',
            },
            requestConfig: {
                timeout: 5000, //request timeout in milliseconds
                noDelay: true, //Enable/disable the Nagle algorithm
                keepAlive: false, //Enable/disable keep-alive functionalityidle socket.
                //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
            },
            responseConfig: {
                timeout: 5000, //response timeout
            },
        };
        if (this.logger) {
            this.logger(`Call POST ${url} with ${JSON.stringify(reqParams)}`);
        }
        const req = this.restClient.post(url, data, callback);

        req.on('requestTimeout', (req: XMLHttpRequest) => {
            if (this.logger) this.logger('request timeout');
            req.abort();
        });

        req.on('responseTimeout', (_res: unknown) => {
            if (this.logger) this.logger('response timeout');
        });

        req.on('error', (err: any) => {
            if (err.code !== undefined) {
                err = err.code;
            } else if (err.message) {
                err = err.message;
            } else {
                err = err.toString();
            }

            callback(new Error(`Error while communicating with Daikin device: ${err}`));
        });
    }

    public setACSpecialMode(
        obj: SetSpecialModeRequest | SetSpecialModeRequestObject,
        callback: DaikinResponseCb<SetCommandResponse>,
    ) {
        if (!(obj instanceof SetSpecialModeRequest)) {
            const state = typeof obj.state === 'string' ? parseInt(obj.state, 10) : obj.state;
            obj = new SetSpecialModeRequest(state, obj.kind);
        }
        const requestDict = obj.getRequestDict();
        this.doPost(`http://${this.ip}/aircon/set_special_mode`, requestDict, (data, _res) => {
            const dict = DaikinDataParser.processResponse(data, callback, requestDict);
            if (dict !== null) SetCommandResponse.parseResponse(dict, callback);
        });
    }

    public getACYearPowerExtended(callback: DaikinResponseCb<YearPowerExtendedResponse>) {
        this.doGet(`http://${this.ip}/aircon/get_year_power_ex`, {}, (data, _res) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) YearPowerExtendedResponse.parseResponse(dict, callback);
        });
    }

    public getCommonBasicInfo(callback: DaikinResponseCb<BasicInfoResponse>) {
        this.doGet(`http://${this.ip}/common/basic_info`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) BasicInfoResponse.parseResponse(dict, callback);
        });
    }

    public getCommonRemoteMethod(callback: DaikinResponseCb<RemoteMethodResponse>) {
        this.doGet(`http://${this.ip}/aircon/get_remote_method`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) RemoteMethodResponse.parseResponse(dict, callback);
        });
    }

    public setCommonLED(ledOn: boolean, callback: DaikinResponseCb<SetCommandResponse>) {
        const requestDict = { led: ledOn ? 1 : 0 };
        this.doPost(`http://${this.ip}/common/set_led`, requestDict, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback, requestDict);
            if (dict !== null) SetCommandResponse.parseResponse(dict, callback);
        });
    }

    public rebootAdapter(callback: DaikinResponseCb<SetCommandResponse>) {
        this.doPost(`http://${this.ip}/common/reboot`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) SetCommandResponse.parseResponse(dict, callback);
        });
    }

    public getACModelInfo(callback: DaikinResponseCb<ModelInfoResponse>) {
        this.doGet(`http://${this.ip}/aircon/get_model_info`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) ModelInfoResponse.parseResponse(dict, callback);
        });
    }

    public getACControlInfo(callback: DaikinResponseCb<ControlInfo>) {
        this.doGet(`http://${this.ip}/aircon/get_control_info`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) ControlInfo.parseResponse(dict, callback);
        });
    }

    public setACControlInfo(obj: ControlInfo, callback: DaikinResponseCb<SetCommandResponse>) {
        try {
            const requestDict = obj.getRequestDict();
            this.doPost(`http://${this.ip}/aircon/set_control_info`, requestDict, (data, _response) => {
                const dict = DaikinDataParser.processResponse(data, callback, requestDict);
                if (dict !== null) SetCommandResponse.parseResponse(dict, callback);
            });
        } catch (e) {
            callback(e instanceof Error ? e : new Error(e as string), null, null);
        }
    }

    public getACDemandControl(callback: DaikinResponseCb<DemandControl>) {
        this.doGet(`http://${this.ip}/aircon/get_demand_control`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) DemandControl.parseResponse(dict, callback);
        });
    }

    public setACDemandControl(obj: DemandControl, callback: DaikinResponseCb<SetCommandResponse>) {
        try {
            const requestDict = obj.getRequestDict();
            this.doPost(`http://${this.ip}/aircon/set_demand_control`, requestDict, (data, _response) => {
                const dict = DaikinDataParser.processResponse(data, callback, requestDict);
                if (dict !== null) SetCommandResponse.parseResponse(dict, callback);
            });
        } catch (e) {
            callback(e instanceof Error ? e : new Error(e as string), null, null);
        }
    }

    public getACSensorInfo(callback: DaikinResponseCb<SensorInfoResponse>) {
        this.doGet(`http://${this.ip}/aircon/get_sensor_info`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) SensorInfoResponse.parseResponse(dict, callback);
        });
    }

    public getACWeekPower(callback: DaikinResponseCb<WeekPowerResponse>) {
        this.doGet(`http://${this.ip}/aircon/get_week_power`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) WeekPowerResponse.parseResponse(dict, callback);
        });
    }

    public getACYearPower(callback: DaikinResponseCb<YearPowerResponse>) {
        if (this.logger) this.logger(`Call GET http://${this.ip}/aircon/get_year_power`);
        this.doGet(`http://${this.ip}/aircon/get_year_power`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) YearPowerResponse.parseResponse(dict, callback);
        });
    }

    public getACWeekPowerExtended(callback: DaikinResponseCb<WeekPowerExtendedResponse>) {
        if (this.logger) this.logger(`Call GET http://${this.ip}/aircon/get_week_power_ex`);
        this.doGet(`http://${this.ip}/aircon/get_week_power_ex`, {}, (data, _response) => {
            const dict = DaikinDataParser.processResponse(data, callback);
            if (dict !== null) WeekPowerExtendedResponse.parseResponse(dict, callback);
        });
    }
}
