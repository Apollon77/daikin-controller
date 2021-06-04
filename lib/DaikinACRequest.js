/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var RestClient = require('node-rest-client').Client;
var DaikinACTypes = require('./DaikinACTypes');


function DaikinACRequest(ip, options) {
    this.ip = ip;
    this.logger = null;
    if (! options) {
        options = {};
    }
    if (typeof options === 'function') {
        this.logger = options;
        options = {};
    }
    else if (options.logger) {
        this.logger = options.logger;
    }

    this.defaultParameters = {};

    this.useGetToPost = false;

    this.getRequest = this.doGet;
    this.postRequest = this.doPost;
    if (options.useGetToPost) {
        this.postRequest = this.doGet;
    }
    this.restClient = new RestClient();
}

DaikinACRequest.prototype.addDefaultParameter = function addDefaultParameter(key, value) {
    this.defaultParameters[key] = value;
};

DaikinACRequest.prototype.getCommonBasicInfo = function getCommonBasicInfo(callback) {
    this.getRequest('http://' + this.ip + '/common/basic_info', function (data, response) {
        parseResponse(data, '/common/basic_info', callback);
    });
};

DaikinACRequest.prototype.getCommonRemoteMethod = function getCommonRemoteMethod(callback) {
    this.getRequest('http://' + this.ip + '/aircon/get_remote_method', function (data, response) {
        parseResponse(data, '/aircon/get_remote_method', callback);
    });
};

DaikinACRequest.prototype.setCommonAdapterLED = function setCommonLED(values, callback) {
    var normalizedVals;
    try {
        normalizedVals = this.normalizeValues(values,'/common/set_led');
    }
    catch (err) {
        if (callback) callback(err.message);
        return;
    }
    this.postRequest('http://' + this.ip + '/common/set_led', normalizedVals, function (data, response) {
        parseResponse(data, 'response', callback);
    });
};

DaikinACRequest.prototype.commonRebootAdapter = function rebootAdapter(callback) {
    this.postRequest('http://' + this.ip + '/common/reboot', function (data, response) {
        parseResponse(data, 'response', callback);
    });
};

DaikinACRequest.prototype.getACModelInfo = function getACModelInfo(callback) {
    this.getRequest('http://' + this.ip + '/aircon/get_model_info', function (data, response) {
        parseResponse(data, '/aircon/get_model_info', callback);
    });
};

DaikinACRequest.prototype.getACControlInfo = function getACControlInfo(callback) {
    this.getRequest('http://' + this.ip + '/aircon/get_control_info', function (data, response) {
        parseResponse(data, '/aircon/get_control_info', callback);
    });
};

DaikinACRequest.prototype.setACControlInfo = function setACControlInfo(values, callback) {
    var normalizedVals;
    try {
        normalizedVals = this.normalizeValues(values,'/aircon/set_control_info');
    }
    catch (err) {
        if (callback) callback(err.message);
        return;
    }
    this.postRequest('http://' + this.ip + '/aircon/set_control_info', normalizedVals, function (data, response) {
        parseResponse(data, 'response', callback);
    });
};

DaikinACRequest.prototype.getACSensorInfo = function getACSensorInfo(callback) {
    this.getRequest('http://' + this.ip + '/aircon/get_sensor_info', function (data, response) {
        parseResponse(data, '/aircon/get_sensor_info', callback);
    });
};

DaikinACRequest.prototype.getACWeekPower = function getACWeekPower(callback) {
    this.getRequest('http://' + this.ip + '/aircon/get_week_power', function (data, response) {
        parseResponse(data, '/aircon/get_week_power', callback);
    });
};

DaikinACRequest.prototype.getACYearPower = function getACYearPower(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_year_power');
    this.getRequest('http://' + this.ip + '/aircon/get_year_power', function (data, response) {
        parseResponse(data, '/aircon/get_year_power', callback);
    });
};

DaikinACRequest.prototype.getACWeekPowerExtended = function getACWeekPowerExtended(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_week_power_ex');
    this.getRequest('http://' + this.ip + '/aircon/get_week_power_ex', function (data, response) {
        parseResponse(data, '/aircon/get_week_power_ex', callback);
    });
};

DaikinACRequest.prototype.getACYearPowerExtended = function getACYearPowerExtended(callback) {
    this.getRequest('http://' + this.ip + '/aircon/get_year_power_ex', function (data, response) {
        parseResponse(data, '/aircon/get_year_power_ex', callback);
    });
};

DaikinACRequest.prototype.setACSpecialMode = function setACSpecialMode(values, callback) {
    var normalizedVals;
    try {
        normalizedVals = this.normalizeValues(values,'/aircon/set_special_mode');
    }
    catch (err) {
        if (callback) callback(err.message);
        return;
    }
    if (normalizedVals.spmode_kind === '0') {
        var vals = {
            'en_streamer': normalizedVals.set_spmode
        };

        this.postRequest('http://' + this.ip + '/aircon/set_special_mode', vals, function (data, response) {
            parseResponse(data, 'response', callback);
        });
    }
    else {
        this.postRequest('http://' + this.ip + '/aircon/set_special_mode', normalizedVals, function (data, response) {
            parseResponse(data, 'response', callback);
        });
    }
};

DaikinACRequest.prototype.normalizeValues = function normalizeValues(values, endpoint) {
    if (!DaikinACTypes.fieldDef[endpoint]) {
        throw Error('Unknown endpoint ' + endpoint);
    }
    var requestValues = {};
    for (var param in DaikinACTypes.fieldDef[endpoint]) {
        //console.log('check ' + param + '/' + DaikinACTypes.fieldDef[endpoint][param].name);
        if (values[DaikinACTypes.fieldDef[endpoint][param].name] !== undefined) {
            requestValues[param] = values[DaikinACTypes.fieldDef[endpoint][param].name];
        }
        else if (values[param] !== undefined) {
            requestValues[param] = values[param];
        }
        else if (DaikinACTypes.fieldDef[endpoint][param].required) {
            throw Error('Required Field ' + param + '/' + DaikinACTypes.fieldDef[endpoint][param].name + ' do not exists');
        }
        //console.log(JSON.stringify(requestValues[param]));
        switch (DaikinACTypes.fieldDef[endpoint][param].type) {
            case 'Boolean':
                requestValues[param] = requestValues[param]?1:0;
                break;
            case 'Integer':
            case 'Float':
                if (typeof requestValues[param] === 'number' && DaikinACTypes.fieldDef[endpoint][param].min && requestValues[param] < DaikinACTypes.fieldDef[endpoint][param].min) {
                    requestValues[param] = DaikinACTypes.fieldDef[endpoint][param].min;
                }
                if (typeof requestValues[param] === 'number' && DaikinACTypes.fieldDef[endpoint][param].max && requestValues[param] > DaikinACTypes.fieldDef[endpoint][param].max) {
                    requestValues[param] = DaikinACTypes.fieldDef[endpoint][param].max;
                }
                break;
            case 'Array':
                if (Array.isArray(requestValues[param])) {
                    requestValues[param] = requestValues[param].join('/');
                }
        }
    }
    if (requestValues.stemp) {
        if (typeof requestValues.stemp === 'number') {
            requestValues.stemp = (Math.round(requestValues.stemp * 2) / 2).toFixed(1);
        }
    }
    if (requestValues.shum) {
        if (typeof requestValues.stemp === 'number') {
            requestValues.shum = Math.round(requestValues.shum);
        }
    }

    return requestValues;
};

DaikinACRequest.prototype.doGet = function doGet(url, parameters, callback) {
    if (typeof parameters === 'function') {
        callback = parameters;
        parameters = undefined;
    }
    var reqParams = Object.assign({}, this.defaultParameters, parameters);
    var data = {
        'parameters': reqParams,
        'headers': {
            'Content-Type': 'text/plain',
            'User-Agent': 'DaikinOnlineController/2.4.2 CFNetwork/978.0.7 Darwin/18.6.0',
            'Accept': '*/*',
            'Accept-Language': 'de-de',
            'Accept-Encoding': 'gzip, deflate'
        },
        'requestConfig': {
            'timeout': 5000, //request timeout in milliseconds
            'noDelay': true, //Enable/disable the Nagle algorithm
            'keepAlive': false //Enable/disable keep-alive functionalityidle socket.
            //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
        },
        'responseConfig': {
            'timeout': 5000 //response timeout
        }
    };
    if (this.logger) this.logger('Call GET ' + url + ' with ' + JSON.stringify(reqParams));
    var req = this.restClient.get(url, data, callback);

    var self = this;
    req.on('requestTimeout', function (req) {
        if (self.logger) self.logger('request has expired');
        req.abort();
    });

    req.on('responseTimeout', function (res) {
        if (self.logger) self.logger('response has expired');
    });

    req.on('error', function (err) {
        if (err.code) {
            err = err.code;
        }
        else if (err.message) {
            err = err.message;
        }
        else {
            err = err.toString();
        }

        callback(new Error('Error while communicating with Daikin device: ' + err));
    });
};

DaikinACRequest.prototype.doPost = function doPost(url, parameters, callback) {
    if (typeof parameters === 'function') {
        callback = parameters;
        parameters = undefined;
    }
    var reqParams = Object.assign({}, this.defaultParameters, parameters);
    var data = {
        'data': reqParams,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'DaikinOnlineController/2.4.2 CFNetwork/978.0.7 Darwin/18.6.0',
            'Accept': '*/*',
            'Accept-Language': 'de-de',
            'Accept-Encoding': 'gzip, deflate'
        },
        'requestConfig': {
            'timeout': 5000, //request timeout in milliseconds
            'noDelay': true, //Enable/disable the Nagle algorithm
            'keepAlive': false //Enable/disable keep-alive functionalityidle socket.
            //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
        },
        'responseConfig': {
            'timeout': 5000 //response timeout
        }
    };
    if (this.logger) this.logger('Call POST ' + url + ' with ' + JSON.stringify(reqParams));
    var req = this.restClient.post(url, data, callback);

    var self = this;
    req.on('requestTimeout', function (req) {
        if (self.logger) self.logger('request has expired');
        req.abort();
    });

    req.on('responseTimeout', function (res) {
        if (self.logger) self.logger('response has expired');
    });

    req.on('error', function (err) {
        if (err.code) {
            err = err.code;
        }
        else if (err.message) {
            err = err.message;
        }
        else {
            err = err.toString();
        }

        callback(new Error('Error while communicating with Daikin device: ' + err));
    });
};

function parseResponse(input, endpoint, callback) {

    function parseDaikinResponse(s) {
        const regex = /(?:^|,)([a-zA-Z0-9_]+)=(.*?)(?=$|,([a-zA-Z0-9_]+)=)/g;
        let match;
        let result = {};
        while(match = regex.exec(s)) {
            result[match[1]] = match[2];
        }
        return result;
    }

    var ret = null;
    var responseData = null;
    if (input instanceof Error) {
        callback(input, null, null);
        return;
    }
    if (Buffer.isBuffer(input)) {
        input = input.toString();
    }

    if (input.includes('=')) {
        responseData = parseDaikinResponse(input);
    } else {
        callback('Cannot parse response: ' + input, null, null);
        return;
    }

    if (responseData.ret) {
        ret = responseData.ret;
        switch (responseData.ret) {
            case 'OK':          delete responseData.ret;
                                break;
            case 'PARAM NG':    delete responseData.ret;
                                callback('Wrong Parameters in request: ' + input, ret, responseData);
                                return;
            case 'ADV NG':      delete responseData.ret;
                                callback('Wrong ADV: ' + input, ret, responseData);
                                return;
            default:            callback('Unknown response: ' + input, ret, responseData);
                                return;
        }
    }
    else {
        callback('Unknown response: ' + input, ret, responseData);
        return;
    }

    if (DaikinACTypes.fieldDef[endpoint]) {
        var mappedResponse = {};
        for (var field in responseData) {
            //console.log('handle field ' + field);
            if (DaikinACTypes.fieldDef[endpoint][field]) {
                //console.log('fielddef for field ' + field + ' exists');
                var fieldHandled = false;
                if (DaikinACTypes.fieldDef[endpoint][field].type !== 'Array' && DaikinACTypes.fieldDef[endpoint][field].altValues) {
                    //console.log('check altVals for field ' + field);
                    for (var altValue in DaikinACTypes.fieldDef[endpoint][field].altValues) {
                        //console.log('check altVals for field ' + field + ' - ' + altValue);
                        if (responseData[field] === DaikinACTypes.fieldDef[endpoint][field].altValues[altValue]) {
                            mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = DaikinACTypes.fieldDef[endpoint][field].altValues[altValue];
                            fieldHandled = true;
                            break;
                        }
                    }
                }
                //console.log('altVals for field ' + field + ' done: ' + fieldHandled);
                if (!fieldHandled) {
                    //console.log('check/convert type for field ' + field + ': ' + DaikinACTypes.fieldDef[endpoint][field].type);
                    switch (DaikinACTypes.fieldDef[endpoint][field].type) {
                        case 'Boolean':
                            if (typeof responseData[field] !== 'number') {
                                responseData[field] = parseInt(responseData[field], 10);
                            }
                            mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = !!responseData[field];
                            break;
                        case 'Integer':
                            if (typeof responseData[field] !== 'number') {
                                mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = parseInt(responseData[field], 10);
                                //console.log('check/convert type for field ' + field + ' TO ' + DaikinACTypes.fieldDef[endpoint][field].type);
                            }
                            else {
                                mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = responseData[field];
                            }
                            break;
                        case 'Float':
                            if (typeof responseData[field] !== 'number') {
                                mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = parseFloat(responseData[field]);
                                //console.log('check/convert type for field ' + field + ' TO ' + DaikinACTypes.fieldDef[endpoint][field].type);
                            }
                            else {
                                mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = responseData[field];
                            }
                            break;
                        case 'Array':
                            var arr = responseData[field].split('/');
                            for (var i = 0; i < arr.length; i++) {
                                arr[i] = parseInt(arr[i], 10);
                            }
                            mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = arr;
                            break;
                        default:
                            mappedResponse[DaikinACTypes.fieldDef[endpoint][field].name] = decodeURIComponent(responseData[field]);
                    }
                }
            }
            else {
                //if (this.logger) this.logger('undefined field ' + field + ' for endpoint ' + endpoint);
            }
        }

        callback(null, ret, mappedResponse);
        return;
    }

	callback(null, ret, responseData);
}

module.exports = DaikinACRequest;
