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
import { DemandControl } from './models/DemandControl';

export * from './DaikinACTypes';

type defaultCallback<T> = (err: Error | null, res: T | null) => void;
type updateErrorCallback = (err: Error | null) => void;

export class DaikinAC {
    get currentACModelInfo(): ModelInfoResponse | null {
        return this._currentACModelInfo;
    }
    get currentACControlInfo(): ControlInfo | null {
        return this._currentACControlInfo;
    }
    get currentACDemandControl(): DemandControl | null {
        return this._currentACDemandControl;
    }
    get currentACSensorInfo(): SensorInfoResponse | null {
        return this._currentACSensorInfo;
    }
    get logger(): Logger | null {
        return this._logger;
    }
    set logger(value: Logger | null) {
        this._logger = value;
    }
    get updateInterval(): number | null {
        return this._updateInterval;
    }
    get currentCommonBasicInfo(): BasicInfoResponse | null {
        return this._currentCommonBasicInfo;
    }
    get updateTimeout(): NodeJS.Timeout | null {
        return this._updateTimeout;
    }

    private _currentACModelInfo: null | ModelInfoResponse = null;
    private _currentACControlInfo: null | ControlInfo = null;
    private _currentACDemandControl: null | DemandControl = null;
    private _currentACSensorInfo: null | SensorInfoResponse = null;

    private _logger: null | Logger;
    private _daikinRequest: DaikinACRequest;
    private _updateInterval: null | number = null;
    private _updateCallback: null | updateErrorCallback = null;
    private _currentCommonBasicInfo: null | BasicInfoResponse = null;
    private _updateTimeout: NodeJS.Timeout | null = null;
    public constructor(ip: string, options: DaikinACOptions, callback: defaultCallback<ModelInfoResponse>) {
        this._logger = null;
        if (options.logger) {
            this._logger = options.logger;
        }
        this._daikinRequest = new DaikinACRequest(ip, options);
        this.getCommonBasicInfo((err, _info) => {
            if (err) {
                if (callback) callback(err, null);
                return;
            }
            this.getACModelInfo(callback);
        });
    }
    public setRequestLogger(value: Logger | null) {
        this._daikinRequest.logger = value;
    }
    public setUpdate(updateInterval: number, callback: updateErrorCallback) {
        this._updateInterval = updateInterval;
        if (typeof callback === 'function') {
            this._updateCallback = callback;
        }
        this.updateData();
    }

    public initUpdateTimeout() {
        if (this._updateInterval && !this._updateTimeout) {
            if (this._logger) this._logger('start update timeout');
            this._updateTimeout = setTimeout(() => {
                this.updateData();
            }, this._updateInterval);
        }
    }

    public clearUpdateTimeout() {
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
            if (this._logger) this._logger('clear update timeout');
        }
    }

    public updateData() {
        this.clearUpdateTimeout();
        this.getACControlInfo((err, _info) => {
            if (err) {
                this.initUpdateTimeout();
                if (this._updateCallback) this._updateCallback(err);
                return;
            }
            this.getACDemandControl((err, _info) => {
                if (err) {
                    this.initUpdateTimeout();
                    if (this._updateCallback) this._updateCallback(err);
                    return;
                }
                this.getACSensorInfo((err, _info) => {
                    this.initUpdateTimeout();
                    if (this._updateCallback) this._updateCallback(err);
                });
            });
        });
    }

    public stopUpdate() {
        this.clearUpdateTimeout();
        this._updateInterval = null;
        this._updateCallback = null;
    }

    public getCommonBasicInfo(callback: defaultCallback<BasicInfoResponse>) {
        this._daikinRequest.getCommonBasicInfo((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            this._currentCommonBasicInfo = daikinResponse;

            if (this._currentCommonBasicInfo && this._currentCommonBasicInfo.lpwFlag === 1) {
                this._daikinRequest && this._daikinRequest.addDefaultParameter('lpw', '');
            }

            if (callback) callback(err, daikinResponse);
        });
    }

    public getCommonRemoteMethod(callback: defaultCallback<RemoteMethodResponse>) {
        this._daikinRequest.getCommonRemoteMethod((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (callback) callback(err, daikinResponse);
        });
    }

    public getACControlInfo(callback: defaultCallback<ControlInfo>) {
        this._daikinRequest.getACControlInfo((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (!err) this._currentACControlInfo = daikinResponse;

            if (callback) callback(err, daikinResponse);
        });
    }

    /**
     * Changes the passed options, the rest remains unchanged
     */
    public setACControlInfo(obj: Partial<ControlInfo>, callback: defaultCallback<ControlInfo>) {
        this.clearUpdateTimeout();
        this._daikinRequest.getACControlInfo((err, _ret, completeValues) => {
            if (err || completeValues === null) {
                this.initUpdateTimeout();
                if (callback) callback(err, completeValues);
                return;
            }
            // we read the current data and change that set in values
            completeValues.overwrite(obj);
            this._daikinRequest.setACControlInfo(completeValues, (errSet, _ret, daikinSetResponse) => {
                if (this._logger) this._logger(JSON.stringify(daikinSetResponse));
                this.getACControlInfo((errGet, daikinGetResponse) => {
                    this.initUpdateTimeout();
                    const errFinal = errSet ? errSet : errGet;
                    if (callback) callback(errFinal, daikinGetResponse);
                });
            });
        });
    }

    public getACDemandControl(callback: defaultCallback<DemandControl>) {
        this._daikinRequest.getACDemandControl((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (!err) this._currentACDemandControl = daikinResponse;

            if (callback) callback(err, daikinResponse);
        });
    }

    /**
     * Changes the passed options, the rest remains unchanged
     */
    public setACDemandControl(obj: Partial<DemandControl>, callback: defaultCallback<DemandControl>) {
        this.clearUpdateTimeout();
        this._daikinRequest.getACDemandControl((err, _ret, completeValues) => {
            if (err || completeValues === null) {
                this.initUpdateTimeout();
                if (callback) callback(err, completeValues);
                return;
            }
            // we read the current data and change that set in values
            completeValues.overwrite(obj);
            this._daikinRequest.setACDemandControl(completeValues, (errSet, _ret, daikinSetResponse) => {
                if (this._logger) this._logger(JSON.stringify(daikinSetResponse));
                this.getACDemandControl((errGet, daikinGetResponse) => {
                    this.initUpdateTimeout();
                    const errFinal = errSet ? errSet : errGet;
                    if (callback) callback(errFinal, daikinGetResponse);
                });
            });
        });
    }

    public getACSensorInfo(callback: defaultCallback<SensorInfoResponse>) {
        this._daikinRequest.getACSensorInfo((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            this._currentACSensorInfo = daikinResponse;

            if (callback) callback(err, daikinResponse);
        });
    }

    public getACModelInfo(callback: defaultCallback<ModelInfoResponse>) {
        this._daikinRequest.getACModelInfo((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            this._currentACModelInfo = daikinResponse;
            if (callback) callback(err, daikinResponse);
        });
    }

    public getACWeekPower(callback: defaultCallback<WeekPowerResponse>) {
        this._daikinRequest.getACWeekPower((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (callback) callback(err, daikinResponse);
        });
    }

    public getACYearPower(callback: defaultCallback<YearPowerResponse>) {
        this._daikinRequest.getACYearPower((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (callback) callback(err, daikinResponse);
        });
    }

    public getACWeekPowerExtended(callback: defaultCallback<WeekPowerExtendedResponse>) {
        this._daikinRequest.getACWeekPowerExtended((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (callback) callback(err, daikinResponse);
        });
    }

    public getACYearPowerExtended(callback: defaultCallback<YearPowerExtendedResponse>) {
        this._daikinRequest.getACYearPowerExtended((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
            if (callback) callback(err, daikinResponse);
        });
    }

    public enableAdapterLED(callback: defaultCallback<SetCommandResponse>) {
        this.clearUpdateTimeout();
        this._daikinRequest.setCommonLED(true, (err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
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
        this._daikinRequest.setCommonLED(false, (err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
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
        this._daikinRequest.rebootAdapter((err, _ret, daikinResponse) => {
            if (this._logger) this._logger(JSON.stringify(daikinResponse));
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

        this._daikinRequest.setACSpecialMode(obj, (errSet, _ret, daikinSetResponse) => {
            this.initUpdateTimeout();
            if (this._logger) this._logger(JSON.stringify(daikinSetResponse));
            if (callback) callback(errSet, daikinSetResponse);
        });
    }
}
