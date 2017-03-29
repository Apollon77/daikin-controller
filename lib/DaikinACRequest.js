/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jslint esversion: 6 */
var RestClient = require('node-rest-client').Client;
var DaikinACTypes = require('./DaikinACTypes');


function DaikinACRequest(ip, logger) {
    this.ip = ip;
    this.logger = null;
    if (logger) {
        this.logger = logger;
    }
    this.restClient = new RestClient();

    // handling client error events
    this.restClient.on('error', function (err) {
        throw Error('Error while communicating with Daikin device: ' + err);
    });

}

DaikinACRequest.prototype.getCommonBasicInfo = function getCommonBasicInfo(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/common/basic_info');
    this.restClient.get('http://' + this.ip + '/common/basic_info', function (data, response) {
        parseResponse(data, '/common/basic_info', callback);
    });
};

DaikinACRequest.prototype.getCommonRemoteMethod = function getCommonRemoteMethod(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_remote_method');
    this.restClient.get('http://' + this.ip + '/aircon/get_remote_method', function (data, response) {
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
    var data = {
        'data':    normalizedVals,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'requestConfig': {
            'timeout':   1000, //request timeout in milliseconds
            'noDelay':   true, //Enable/disable the Nagle algorithm
            'keepAlive': false, //Enable/disable keep-alive functionalityidle socket.
            //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
        },
        'responseConfig': {
            'timeout': 1000 //response timeout
        }
    };
    if (this.logger) this.logger('Call POST http://' + this.ip + '/common/set_led with ' + JSON.stringify(normalizedVals));
    this.restClient.post('http://' + this.ip + '/common/set_led', data, function (data, response) {
        parseResponse(data, 'response', callback);
    });
};

DaikinACRequest.prototype.commonRebootAdapter = function rebootAdapter(callback) {
    if (this.logger) this.logger('Call POST http://' + this.ip + '/common/reboot');
    var data = {
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'requestConfig': {
            'timeout':   1000, //request timeout in milliseconds
            'noDelay':   true, //Enable/disable the Nagle algorithm
            'keepAlive': false, //Enable/disable keep-alive functionalityidle socket.
            //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
        },
        'responseConfig': {
            'timeout': 1000 //response timeout
        }    };
    this.restClient.post('http://' + this.ip + '/common/reboot', data, function (data, response) {
        parseResponse(data, 'response', callback);
    });
};

DaikinACRequest.prototype.getACModelInfo = function getACModelInfo(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_model_info');
    this.restClient.get('http://' + this.ip + '/aircon/get_model_info', function (data, response) {
        parseResponse(data, '/aircon/get_model_info', callback);
    });
};

DaikinACRequest.prototype.getACControlInfo = function getACControlInfo(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_control_info');
    this.restClient.get('http://' + this.ip + '/aircon/get_control_info', function (data, response) {
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
    if (this.logger) this.logger('Call POST http://' + this.ip + '/aircon/set_control_info with ' + JSON.stringify(normalizedVals));
    var data = {
        'data':    normalizedVals,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'requestConfig': {
            'timeout':   1000, //request timeout in milliseconds
            'noDelay':   true, //Enable/disable the Nagle algorithm
            'keepAlive': false, //Enable/disable keep-alive functionalityidle socket.
            //keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
        },
        'responseConfig': {
            'timeout': 1000 //response timeout
        }    };
    this.restClient.post('http://' + this.ip + '/aircon/set_control_info', data , function (data, response) {
        parseResponse(data, 'response', callback);
    });
};

DaikinACRequest.prototype.getACSensorInfo = function getACSensorInfo(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_sensor_info');
    this.restClient.get('http://' + this.ip + '/aircon/get_sensor_info', function (data, response) {
        parseResponse(data, '/aircon/get_sensor_info', callback);
    });
};

DaikinACRequest.prototype.getACWeekPower = function getACWeekPower(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_week_power');
    this.restClient.get('http://' + this.ip + '/aircon/get_week_power', function (data, response) {
        parseResponse(data, '/aircon/get_week_power', callback);
    });
};

DaikinACRequest.prototype.getACYearPower = function getACYearPower(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_year_power');
    this.restClient.get('http://' + this.ip + '/aircon/get_year_power', function (data, response) {
        parseResponse(data, '/aircon/get_year_power', callback);
    });
};

DaikinACRequest.prototype.getACWeekPowerExtended = function getACWeekPowerExtended(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_week_power_ex');
    this.restClient.get('http://' + this.ip + '/aircon/get_week_power_ex', function (data, response) {
        parseResponse(data, '/aircon/get_week_power_ex', callback);
    });
};

DaikinACRequest.prototype.getACYearPowerExtended = function getACYearPowerExtended(callback) {
    if (this.logger) this.logger('Call GET http://' + this.ip + '/aircon/get_year_power_ex');
    this.restClient.get('http://' + this.ip + '/aircon/get_year_power_ex', function (data, response) {
        parseResponse(data, '/aircon/get_year_power_ex', callback);
    });
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
    if (requestValues.stemp) requestValues.stemp=(Math.round(requestValues.stemp * 2) / 2).toFixed(1);
    if (requestValues.shum) requestValues.shum=Math.round(requestValues.shum);

    return requestValues;
};

function parseResponse(input, endpoint, callback) {
	// Daikin systems respond with HTTP response strings, not JSON objects. JSON is much easier to
	// parse, so we convert it with some RegExp here.

    function escapeRegExp(str) {
    	return str.replace(/([.*+?^=!:${}()|\[\]\/\\]\")/g, "\\$1");
    	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    }

    function replaceAll(str, find, replace) {
    	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    	// From http://stackoverflow.com/a/1144788
    }

    if (Buffer.isBuffer(input)) {
        input = input.toString();
    }
	input2 = replaceAll(input, "\=", "\":\"");
	input2 = replaceAll(input2, ",", "\",\"");

    var responseData = JSON.parse("{\"" + input2 + "\"}");
    var ret = null;

    if (responseData.ret) {
        ret = responseData.ret;
        switch (responseData.ret) {
            case 'OK':          delete responseData.ret;
                                break;
            case 'PARAM NG':    delete responseData.ret;
                                callback('Wrong Parameters in request: ' + input, ret, responseData);
                                return;
            case 'ADV_NG':      delete responseData.ret;
                                callback('Wrong ADV: ' + input, ret, responseData);
                                return;
            default:            callback('Unknown response: ' + input, ret, responseData);
                                return;
        }
    }
    else {
        callback('Unknown response: ' + input, ret, responseData);
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
                        if (responseData[field] == DaikinACTypes.fieldDef[endpoint][field].altValues[altValue]) {
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
                if (this.logger) this.logger('undefined field ' + field + ' for endpoint ' + endpoint);
            }
        }

        callback(null, ret, mappedResponse);
        return;
    }

	callback(null, ret, responseData);
}

module.exports = DaikinACRequest;
