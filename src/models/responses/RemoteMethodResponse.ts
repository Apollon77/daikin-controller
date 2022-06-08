import {DaikinDataParser, ResponseDict} from "../../DaikinDataParser";
import {DaikinResponseCb} from "../../DaikinACRequest";

export class RemoteMethodResponse {
  public method?: string;
  public noticeIpInt?: number;
  public noticeSyncInt?: number;

  public static parseResponse(dict: ResponseDict, cb: DaikinResponseCb<RemoteMethodResponse>): void {
    const result = new RemoteMethodResponse();
    result.method = DaikinDataParser.resolveString(dict, 'method');
    result.noticeIpInt = DaikinDataParser.resolveInteger(dict, 'notice_ip_int');
    result.noticeSyncInt = DaikinDataParser.resolveInteger(dict, 'notice_sync_int');
    cb(null, 'OK', result);
  }
}
