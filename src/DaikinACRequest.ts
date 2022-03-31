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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RestClient = require('node-rest-client').Client;

export type Logger = null | undefined | ((data: string | null) => void);

export interface DaikinACOptions {
  logger?: Logger;
  useGetToPost?: boolean;
}

export type ResponseHandler = (data: Error | string | Buffer, response?: unknown) => void;
export type DaikinResponseCb<T> = (err: string | null, ret: any | null, daikinResponse: T | null) => void;

export class DaikinACRequest {
  private readonly logger: Logger | null = null;
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
      if (this.logger) this.logger('request has expired');
      req.abort();
      callback(new Error(`Error while communicating with Daikin device: Timeout`));
    });

    req.on('responseTimeout', (_res: any) => {
      if (this.logger) this.logger('response has expired');
    });

    req.on('error', (err: any) => {
      if (err.code) {
        err = err.code;
      } else if (err.message) {
        err = err.message;
      } else {
        err = err.toString();
      }

      callback(new Error(`Error while communicating with Daikin device: ${err}`));
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
      if (this.logger) this.logger('request has expired');
      req.abort();
    });

    req.on('responseTimeout', (_res: unknown) => {
      if (this.logger) this.logger('response has expired');
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

  public setACSpecialMode(obj: SetSpecialModeRequest, callback: DaikinResponseCb<SetCommandResponse>) {
    this.doPost(`http://${this.ip}/aircon/set_special_mode`, obj.getRequestDict(), (data, _res) => {
      const dict = DaikinDataParser.processResponse(data, callback);
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
    this.doPost(`http://${this.ip}/common/set_led`, { led: ledOn ? 1 : 0 }, (data, _response) => {
      const dict = DaikinDataParser.processResponse(data, callback);
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
      this.doPost(`http://${this.ip}/aircon/set_control_info`, obj.getRequestDict(), (data, _response) => {
        const dict = DaikinDataParser.processResponse(data, callback);
        if (dict !== null) SetCommandResponse.parseResponse(dict, callback);
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : (e as string);
      callback(errorMessage, null, null);
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
