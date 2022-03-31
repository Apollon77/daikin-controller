import { DaikinDataParser, ResponseDict } from '../../DaikinDataParser';
import { Power } from '../../DaikinACTypes';
import { DaikinResponseCb } from '../../DaikinACRequest';

const AdpMode: { [key: string]: string } = {
  RUN: 'run',
};
const Method: { [key: string]: string } = {
  POLLING: 'polling',
};
const Type: { [key: string]: string } = {
  AC: 'aircon',
  // ...
};

export class BasicInfoResponse {
  public type?: string;
  public region?: string;
  public dst?: boolean;
  public adapterVersion?: string;
  public power?: boolean;
  public location?: number;
  public name?: string;
  public icon?: number;
  public method?: string;
  public port?: number;
  public id?: string; // unit identifier
  public password?: string; // password
  public lpwFlag?: number;
  public pv?: number;
  public cpv?: number;
  public cpvMinor?: number;
  public led?: boolean; // status LED on or off
  public enSetzone?: number;
  public macAddress?: string;
  public adapterMode?: string;
  public error?: number; // 255
  public enHol?: number;
  public enGroup?: number;
  public groupName?: string;
  public adapterKind?: number;

  public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<BasicInfoResponse>): void {
    const result = new BasicInfoResponse();
    result.type = DaikinDataParser.resolveString(dict, 'type', Type);
    result.region = DaikinDataParser.resolveString(dict, 'reg');
    result.dst = DaikinDataParser.resolveBool(dict, 'dst');
    result.adapterVersion = DaikinDataParser.resolveString(dict, 'ver');
    result.power = DaikinDataParser.resolveBool(dict, 'pow', Power);
    result.location = DaikinDataParser.resolveInteger(dict, 'location');
    result.name = DaikinDataParser.resolveString(dict, 'name');
    result.icon = DaikinDataParser.resolveInteger(dict, 'icon');
    result.method = DaikinDataParser.resolveString(dict, 'method', Method);
    result.port = DaikinDataParser.resolveInteger(dict, 'port');
    result.id = DaikinDataParser.resolveString(dict, 'id');
    result.password = DaikinDataParser.resolveString(dict, 'pw');
    result.lpwFlag = DaikinDataParser.resolveInteger(dict, 'lpw_flag');
    result.pv = DaikinDataParser.resolveInteger(dict, 'pv');
    result.cpv = DaikinDataParser.resolveInteger(dict, 'cpv');
    result.cpvMinor = DaikinDataParser.resolveInteger(dict, 'cpv_minor');
    result.led = DaikinDataParser.resolveBool(dict, 'led');
    result.enSetzone = DaikinDataParser.resolveInteger(dict, 'en_setzone');
    result.macAddress = DaikinDataParser.resolveString(dict, 'mac');
    result.adapterMode = DaikinDataParser.resolveString(dict, 'adp_mode', AdpMode);
    result.error = DaikinDataParser.resolveInteger(dict, 'err'); // 255
    result.enHol = DaikinDataParser.resolveInteger(dict, 'en_hol');
    result.enGroup = DaikinDataParser.resolveInteger(dict, 'en_grp');
    result.groupName = DaikinDataParser.resolveString(dict, 'grp_name');
    result.adapterKind = DaikinDataParser.resolveInteger(dict, 'adp_kind');
    cb(null, 'OK', result);
  }
}
