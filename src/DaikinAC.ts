import {
  BasicInfoResponse,
  ControlInfo,
  ModelInfoResponse,
  RemoteMethodResponse,
  SensorInfoResponse,
  SetCommandResponse,
  SetSpecialModeRequest,
  WeekPowerExtendedResponse,
  WeekPowerResponse,
  YearPowerExtendedResponse,
  YearPowerResponse,
} from './models';
import { DaikinACOptions, DaikinACRequest, Logger } from './DaikinACRequest';

type defaultCallback<T> = (err: string | null, res: T | null) => void;

export class DaikinAC {
  public currentCommonBasicInfo: null | BasicInfoResponse = null;
  public currentACModelInfo: null | ModelInfoResponse = null;
  public currentACControlInfo: null | ControlInfo = null;
  public currentACSensorInfo: null | SensorInfoResponse = null;

  private logger: null | Logger;
  private daikinRequest: DaikinACRequest;
  private updateInterval: null | number = null;
  private updateTimeout: NodeJS.Timeout | null = null;
  private updateCallback: null | Logger = null;
  public constructor(ip: string, options: DaikinACOptions, callback: defaultCallback<ModelInfoResponse>) {
    this.logger = null;
    if (options.logger) {
      this.logger = options.logger;
    }
    this.daikinRequest = new DaikinACRequest(ip, options);
    this.getCommonBasicInfo((err, _info) => {
      if (err) {
        if (callback) callback(err, null);
        return;
      }
      this.getACModelInfo(callback);
    });
  }
  public setUpdate(updateInterval: number, callback: Logger) {
    this.updateInterval = updateInterval;
    if (typeof callback === 'function') {
      this.updateCallback = callback;
    }
    this.updateData();
  }

  public initUpdateTimeout() {
    if (this.updateInterval && !this.updateTimeout) {
      if (this.logger) this.logger('start update timeout');
      this.updateTimeout = setTimeout(() => {
        this.updateData();
      }, this.updateInterval);
    }
  }

  public clearUpdateTimeout() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
      if (this.logger) this.logger('clear update timeout');
    }
  }

  public updateData() {
    this.clearUpdateTimeout();
    this.getACControlInfo((err, _info) => {
      if (err) {
        this.initUpdateTimeout();
        if (this.updateCallback) this.updateCallback(err);
        return;
      }
      this.getACSensorInfo((err, _info) => {
        this.initUpdateTimeout();
        if (this.updateCallback) this.updateCallback(err);
      });
    });
  }

  public stopUpdate() {
    this.clearUpdateTimeout();
    this.updateInterval = null;
    this.updateCallback = null;
  }

  public getCommonBasicInfo(callback: defaultCallback<BasicInfoResponse>) {
    this.daikinRequest.getCommonBasicInfo((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      this.currentCommonBasicInfo = daikinResponse;

      if (this.currentCommonBasicInfo && this.currentCommonBasicInfo.lpwFlag === 1) {
        this.daikinRequest && this.daikinRequest.addDefaultParameter('lpw', '');
      }

      if (callback) callback(err, daikinResponse);
    });
  }

  public getCommonRemoteMethod(callback: defaultCallback<RemoteMethodResponse>) {
    this.daikinRequest.getCommonRemoteMethod((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (callback) callback(err, daikinResponse);
    });
  }

  public getACControlInfo(callback: defaultCallback<ControlInfo>) {
    this.daikinRequest.getACControlInfo((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (!err) this.currentACControlInfo = daikinResponse;

      if (callback) callback(err, daikinResponse);
    });
  }

  /**
   * Changes the passed options, the rest remains unchanged
   */
  public setACControlInfo(obj: ControlInfo, callback: defaultCallback<ControlInfo>) {
    this.clearUpdateTimeout();
    this.daikinRequest.getACControlInfo((err, _ret, completeValues) => {
      if (err || completeValues === null) {
        this.initUpdateTimeout();
        if (callback) callback(err, completeValues);
        return;
      }
      // we read the current data and change that set in values
      completeValues.overwrite(obj);
      this.daikinRequest.setACControlInfo(completeValues, (errSet, _ret, daikinSetResponse) => {
        if (this.logger) this.logger(JSON.stringify(daikinSetResponse));
        this.getACControlInfo((errGet, daikinGetResponse) => {
          this.initUpdateTimeout();
          const errFinal = errSet ? errSet : errGet;
          if (callback) callback(errFinal, daikinGetResponse);
        });
      });
    });
  }

  public getACSensorInfo(callback: defaultCallback<SensorInfoResponse>) {
    this.daikinRequest.getACSensorInfo((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      this.currentACSensorInfo = daikinResponse;

      if (callback) callback(err, daikinResponse);
    });
  }

  public getACModelInfo(callback: defaultCallback<ModelInfoResponse>) {
    this.daikinRequest.getACModelInfo((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      this.currentACModelInfo = daikinResponse;
      if (callback) callback(err, daikinResponse);
    });
  }

  public getACWeekPower(callback: defaultCallback<WeekPowerResponse>) {
    this.daikinRequest.getACWeekPower((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (callback) callback(err, daikinResponse);
    });
  }

  public getACYearPower(callback: defaultCallback<YearPowerResponse>) {
    this.daikinRequest.getACYearPower((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (callback) callback(err, daikinResponse);
    });
  }

  public getACWeekPowerExtended(callback: defaultCallback<WeekPowerExtendedResponse>) {
    this.daikinRequest.getACWeekPowerExtended((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (callback) callback(err, daikinResponse);
    });
  }

  public getACYearPowerExtended(callback: defaultCallback<YearPowerExtendedResponse>) {
    this.daikinRequest.getACYearPowerExtended((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (callback) callback(err, daikinResponse);
    });
  }

  public enableAdapterLED(callback: defaultCallback<SetCommandResponse>) {
    this.clearUpdateTimeout();
    this.daikinRequest.setCommonLED(true, (err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (err) {
        this.initUpdateTimeout();
        if (callback) callback(err, daikinResponse);
        return;
      }
      this.getCommonBasicInfo((errGet, _daikinGetResponse) => {
        this.initUpdateTimeout();
        const errFinal = err ? err : errGet;
        if (callback) callback(errFinal, daikinResponse);
      });
    });
  }

  public disableAdapterLED(callback: defaultCallback<SetCommandResponse>) {
    this.clearUpdateTimeout();
    this.daikinRequest.setCommonLED(false, (err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (err) {
        this.initUpdateTimeout();
        if (callback) callback(err, daikinResponse);
        return;
      }
      this.getCommonBasicInfo((errGet, _daikinGetResponse) => {
        this.initUpdateTimeout();
        const errFinal = err ? err : errGet;
        if (callback) callback(errFinal, daikinResponse);
      });
    });
  }

  public rebootAdapter(callback: defaultCallback<SetCommandResponse>) {
    this.clearUpdateTimeout();
    this.daikinRequest.rebootAdapter((err, _ret, daikinResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinResponse));
      if (err) {
        this.initUpdateTimeout();
        if (callback) callback(err, daikinResponse);
        return;
      }
      setTimeout(() => {
        this.getCommonBasicInfo((errGet, _daikinGetResponse) => {
          this.initUpdateTimeout();
          const errFinal = err ? err : errGet;
          if (callback) callback(errFinal, daikinResponse);
        });
      }, 2000);
    });
  }

  public setACSpecialMode(obj: SetSpecialModeRequest, callback: defaultCallback<SetCommandResponse>) {
    this.clearUpdateTimeout();

    this.daikinRequest.setACSpecialMode(obj, (errSet, _ret, daikinSetResponse) => {
      if (this.logger) this.logger(JSON.stringify(daikinSetResponse));
      if (callback) callback(errSet, daikinSetResponse);
    });
  }
}
