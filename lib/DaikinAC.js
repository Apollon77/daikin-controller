/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jslint esversion: 6 */
var DaikinACRequest = require('./DaikinACRequest');
var DaikinACTypes = require('./DaikinACTypes');

function DaikinAC(ip, options, callback) {
    if (typeof options === 'function' && !callback) {
        callback = options;
        options= {};
    }
    if (!options) {
        options = {};
    }
    this.logger = null;
    if (options.logger) {
        this.logger = options.logger;
    }
    this.daikinRequest = new DaikinACRequest(ip, this.logger);
    this.updateInterval = null;
    this.updateTimeout = null;
    this.updateCallback = null;

    this.currentCommonBasicInfo = null;
    this.currentACModelInfo = null;
    this.currentACControlInfo = null;
    this.currentACSensorInfo = null;

    self = this;
    this.getCommonBasicInfo(function(err) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        self.getACModelInfo(callback);
    });
}

DaikinAC.prototype.setUpdate = function setUpdate(updateInterval, callback) {
    this.updateInterval = updateInterval;
    if (typeof callback === 'function') {
        this.updateCallback = callback;
    }
    this.updateData();
};

DaikinAC.prototype.updateData = function updateData() {
    if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
    }
    self = this;
    this.getACControlInfo(function(err) {
        if (err) {
            if (self.updateInterval) {
                self.updateTimeout = setTimeout(function() {
                    self.updateData();
                }, self.updateInterval);
            }
            if (self.updateCallback) self.updateCallback(err);
            return;
        }
        self.getACSensorInfo(function (err) {
            if (self.updateInterval) {
                self.updateTimeout = setTimeout(function() {
                    self.updateData();
                }, self.updateInterval);
            }
            if (self.updateCallback) self.updateCallback(err);
        });
    });

};

DaikinAC.prototype.stopUpdate = function stopUpdate() {
    if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = null;
    this.updateCallback = null;
};

DaikinAC.prototype.getCommonBasicInfo = function getCommonBasicInfo(callback) {
    self = this;
    this.daikinRequest.getCommonBasicInfo(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        self.currentCommonBasicInfo = daikinResponse;

        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getCommonRemoteMethod = function getCommonRemoteMethod(callback) {
    this.daikinRequest.getCommonRemoteMethod(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getACControlInfo = function getACControlInfo(callback) {
    self = this;
    this.daikinRequest.getACControlInfo(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        self.currentACControlInfo = daikinResponse;

        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.setACControlInfo = function setACControlInfo(values, callback) {
    self = this;
    this.daikinRequest.getACControlInfo(function (err, ret, completeValues) {
        if (err) {
            if (callback) callback(err, completeValues);
            return;
        }
        // we read the current data and change that set in values
        for (var key in values) {
            completeValues[key] = values[key];
        }
        self.daikinRequest.setACControlInfo(completeValues, function(errSet, ret, daikinSetResponse) {
            if (self.logger) self.logger(JSON.stringify(daikinResponse));
            self.getACControlInfo(function(errGet, daikinGetResponse) {
                var errFinal = errSet ? errSet : errGet;
                if (callback) callback(errFinal, daikinGetResponse);
            });
        });
    });
};

DaikinAC.prototype.getACSensorInfo = function getACSensorInfo(callback) {
    this.daikinRequest.getACSensorInfo(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        self.currentACSensorInfo = daikinResponse;

        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getACModelInfo = function getACModelInfo(callback) {
    this.daikinRequest.getACModelInfo(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        self.currentACModelInfo = daikinResponse;
        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getACWeekPower = function getACWeekPower(callback) {
    this.daikinRequest.getACWeekPower(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getACYearPower = function getACYearPower(callback) {
    this.daikinRequest.getACYearPower(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getACWeekPowerExtended = function getACWeekPowerExtended(callback) {
    this.daikinRequest.getACWeekPowerExtended(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.getACYearPowerExtended = function getACYearPowerExtended(callback) {
    this.daikinRequest.getACYearPowerExtended(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (callback) callback(err, daikinResponse);
    });
};

DaikinAC.prototype.enableAdapterLED = function enableAdapterLED(callback) {
    self = this;
    this.daikinRequest.setCommonAdapterLED({'led': true}, function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (err) {
            if (callback) callback(err, daikinResponse);
            return;
        }
        self.getCommonBasicInfo(function(errGet, daikinGetResponse) {
            var errFinal = err ? err : errGet;
            if (callback) callback(errFinal, daikinResponse);
        });
    });
};

DaikinAC.prototype.disableAdapterLED = function disableAdapterLED(callback) {
    self = this;
    this.daikinRequest.setCommonAdapterLED({'led': false}, function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (err) {
            if (callback) callback(err, daikinResponse);
            return;
        }
        self.getCommonBasicInfo(function(errGet, daikinGetResponse) {
            var errFinal = err ? err : errGet;
            if (callback) callback(errFinal, daikinResponse);
        });
    });
};

DaikinAC.prototype.rebootAdapter = function rebootAdapter(callback) {
    self = this;
    this.daikinRequest.commonRebootAdapter(function (err, ret, daikinResponse) {
        if (self.logger) self.logger(JSON.stringify(daikinResponse));
        if (err) {
            if (callback) callback(err, daikinResponse);
            return;
        }
        setTimeout(function() {
            self.getCommonBasicInfo(function(errGet, daikinGetResponse) {
                var errFinal = err ? err : errGet;
                if (callback) callback(errFinal, daikinResponse);
            });
        }, 2000);
    });
};


module.exports = DaikinAC;
module.exports.Power = DaikinACTypes.Power;
module.exports.Mode = DaikinACTypes.Mode;
module.exports.FanRate = DaikinACTypes.FanRate;
module.exports.FanDirection = DaikinACTypes.FanDirection;
