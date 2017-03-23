/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jslint esversion: 6 */

var Power = {
	'OFF': false,
	'ON':  true
};

var Mode = {
	'AUTO':     0,
	'AUTO1':    1,
	'AUTO2':    7,
	'DEHUMDID': 2,
	'COLD':     3,
	'HOT':      4,
	'FAN':      6,
};

var FanRate = {
	'AUTO':    'A',
	'SILENCE': 'B',
	'LEVEL_1': 3,
	'LEVEL_2': 4,
	'LEVEL_3': 5,
	'LEVEL_4': 6,
	'LEVEL_5': 7
};

var FanDirection = {
	'STOP':       0,
	'VERTICAL':   1,
	'HORIZONTAL': 2,
	'VERTICAL_AND_HORIZONTAL': 3
};

var ErrorCode = {
	OK: 0
};

var Type = {
	'AC': "aircon"
	// ...
};

var Method = {
	'POLLING': "polling",
};

var AdpMode = {
	'RUN': "run"
};

var fieldDef = {
    '/common/basic_info': {
        'type':         {'name': 'type', 'type': 'String', 'altValues': Type, 'writeable': false},
        'reg':          {'name': 'region', 'type': 'String', 'writeable': false},
        'dst':          {'name': 'dst', 'type': 'Boolean', 'writeable': false},
        'ver':          {'name': 'adapterVersion', 'type': 'String', 'writeable': false},
        'pow':          {'name': 'power', 'type': 'Boolean', 'altValues': Power, 'writeable': false},
        'error':        {'name': 'error', 'type': 'Integer', 'writeable': false},
        'location':     {'name': 'location', 'type': 'Integer', 'writeable': false},
        'name':         {'name': 'name', 'type': 'String', 'writeable': false},
        'icon':         {'name': 'icon', 'type': 'Integer', 'writeable': false},
        'method':       {'name': 'method', 'type': 'String', 'altValues': Method, 'writeable': false},
        'port':         {'name': 'port', 'type': 'Integer', 'writeable': false},
        'id':           {'name': 'id', 'type': 'String', 'writeable': false}, // unit identifier
        'pw':           {'name': 'password', 'type': 'String', 'writeable': false}, // password
        'lpw_flag':     {'name': 'lpw_flag', 'type': 'Integer', 'writeable': false},
        'pv':           {'name': 'pv', 'type': 'Integer', 'writeable': false},
        'cpv':          {'name': 'cpv', 'type': 'Integer', 'writeable': false},
        'cpv_minor':    {'name': 'cpvMinor', 'type': 'Integer', 'writeable': false},
        'led':          {'name': 'led', 'type': 'Boolean', 'writeable': false}, // status LED on or off
        'en_setzone':   {'name': 'en_setzone', 'type': 'Integer', 'writeable': false},
        'mac':          {'name': 'macAddress', 'type': 'String', 'writeable': false},
        'adp_mode':     {'name': 'adapterMode', 'type': 'String', 'altValues': AdpMode, 'writeable': false},
        'err':          {'name': 'error', 'type': 'Integer', 'writeable': false},		// 255
        'en_hol':       {'name': 'en_hol', 'type': 'Integer', 'writeable': false},
        'en_grp':       {'name': 'en_grp', 'type': 'Integer', 'writeable': false},
        'grp_name':     {'name': 'groupName', 'type': 'String', 'writeable': false},
        'adp_kind':     {'name': 'adapterKind', 'type': 'Integer', 'writeable': false}
    },
    '/common/get_remote_method': {
        'method':          {'name': 'method', 'type': 'String', 'writeable': false},
        'notice_ip_int':   {'name': 'notice_ip_int', 'type': 'Integer', 'writeable': false},
        'notice_sync_int': {'name': 'notice_sync_int', 'type': 'Integer', 'writeable': false},
    },
    '/aircon/get_control_info': {
        'pow':          {'name': 'power', 'type': 'Boolean', 'altValues': Power, 'writeable': true},
    	'mode':         {'name': 'mode', 'type': 'Integer', 'altValues': Mode, 'min': 0, 'max': 7, 'writeable': true},
    	'stemp':        {'name': 'targetTemperature', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': true},
    	'shum':         {'name': 'targetHumidity', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': true},		// "AUTO" or Number from 0..50
    	'f_rate':       {'name': 'fanRate', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': true},
    	'f_dir':        {'name': 'fanDirection', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': true},

    	// the following are returned, but not set-able
    	'adv':          {'name': 'adv', 'type': 'String', 'writeable': false},			// ????

    	'dt1':          {'name': 'targetTemperatureMode1', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': false},		// "M" or Number 10..41
    	'dt2':          {'name': 'targetTemperatureMode2', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': false},
    	'dt3':          {'name': 'targetTemperatureMode3', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': false},
    	'dt4':          {'name': 'targetTemperatureMode4', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': false},
    	'dt5':          {'name': 'targetTemperatureMode5', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': false},
    	'dt7':          {'name': 'targetTemperatureMode7', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'writeable': false},

    	'dh1':          {'name': 'targetHumidityMode1', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number
    	'dh2':          {'name': 'targetHumidityMode2', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number
    	'dh3':          {'name': 'targetHumidityMode3', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number
    	'dh4':          {'name': 'targetHumidityMode4', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number
    	'dh5':          {'name': 'targetHumidityMode5', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number
    	'dh7':          {'name': 'targetHumidityMode7', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number
    	'dhh':          {'name': 'targetHumidityModeH', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'writeable': false},		// AUTO or Number

        'dfr1':         {'name': 'fanRateMode1', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
    	'dfr2':         {'name': 'fanRateMode2', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
    	'dfr3':         {'name': 'fanRateMode3', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
    	'dfr4':         {'name': 'fanRateMode4', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
    	'dfr5':         {'name': 'fanRateMode5', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
        'dfr6':         {'name': 'fanRateMode6', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
        'dfr7':         {'name': 'fanRateMode7', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},
    	'dfrh':         {'name': 'fanRateModeH', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'writeable': false},

        'dfd1':         {'name': 'fanDirectionMode1', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
    	'dfd2':         {'name': 'fanDirectionMode2', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
    	'dfd3':         {'name': 'fanDirectionMode3', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
    	'dfd4':         {'name': 'fanDirectionMode4', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
    	'dfd5':         {'name': 'fanDirectionMode5', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
        'dfd6':         {'name': 'fanDirectionMode6', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
        'dfd7':         {'name': 'fanDirectionMode7', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},
    	'dfdh':         {'name': 'fanDirectionModeH', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'writeable': false},

    	'b_mode':       {'name': 'ModeB', 'type': 'Integer', 'altValues': Mode, 'writeable': false},
    	'b_stemp':      {'name': 'targetTemperatureB', 'type': 'Float', 'altValues': {'M': 'M'}, 'writeable': false},
    	'b_shum':       {'name': 'targetHumidityB', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'writeable': false},
        'b_f_rate':     {'name': 'fanRateB', 'type': 'Integer', 'altValues': FanRate, 'writeable': false},
    	'b_f_dir':      {'name': 'fanDirectionB', 'type': 'Integer', 'altValues': FanDirection, 'writeable': false},

    	'alert':        {'name': 'error', 'type': 'Integer', 'writeable': false}		// 255
    },
    '/aircon/set_control_info': {
        'pow':          {'name': 'power', 'type': 'Boolean', 'altValues': Power, 'required': true},
    	'mode':         {'name': 'mode', 'type': 'Integer', 'altValues': Mode, 'min': 0, 'max': 7, 'required': true},
    	'stemp':        {'name': 'targetTemperature', 'type': 'Float', 'altValues': {'M': 'M'}, 'min': 10, 'max': 41, 'required': true},
    	'shum':         {'name': 'targetHumidity', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}, 'min': 0, 'max': 50, 'required': true},		// "AUTO" or Number from 0..50
    	'f_rate':       {'name': 'fanRate', 'type': 'Integer', 'altValues': FanRate, 'min': 3, 'max': 7, 'required': false},
    	'f_dir':        {'name': 'fanDirection', 'type': 'Integer', 'altValues': FanDirection, 'min': 0, 'max': 3, 'required': false}
    },
    '/aircon/get_model_info': { //ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1
        'model':        {'name': 'model', 'type': 'String', 'writeable': false},
        'type':         {'name': 'type', 'type': 'String', 'writeable': false},
        'pv':           {'name': 'pv', 'type': 'Integer', 'writeable': false},
        'cpv':          {'name': 'cpv', 'type': 'Integer', 'writeable': false},
        'mid':          {'name': 'mid', 'type': 'String', 'writeable': false},
        's_fdir':       {'name': 's_fanDirection', 'type': 'Integer', 'altValues': FanDirection, 'writeable': false},
        'en_scdltmr':   {'name': 'en_scdltmr', 'type': 'Integer', 'writeable': false}
    },
    '/aircon/get_sensor_info': { // ret=OK,htemp=21.5,hhum=-,otemp=-,err=0,cmpfreq=0
        'htemp':        {'name': 'indoorTemperature', 'type': 'Float', 'writeable': false},
        'hhum':         {'name': 'indoorHumidity', 'type': 'Float', 'writeable': false},
        'otemp':        {'name': 'outdoorTemperature', 'type': 'Float', 'writeable': false},
        'err':          {'name': 'error', 'type': 'Integer', 'writeable': false},
        'cmpfreq':      {'name': 'cmpfreq', 'type': 'Integer', 'writeable': false}
    },
    '/aircon/get_week_power': { // ret=OK,today_runtime=24,datas=0/0/0/0/0/0/0
        'today_runtime': {'name': 'todayRuntime', 'type': 'Integer', 'writeable': false},
        'datas':         {'name': 'data', 'type': 'Array', 'writeable': false}
    },
    '/aircon/get_year_power': { // ret=OK,previous_year=0/0/0/0/0/0/0/0/0/0/0/0,this_year=0/0/0
        'previous_year': {'name': 'previousYear', 'type': 'Array', 'writeable': false},
        'this_year':     {'name': 'currentYear', 'type': 'Array', 'writeable': false}
    },
    '/aircon/get_week_power_ex': { // ret=OK,s_dayw=6,week_heat=0/0/0/0/0/0/0/0/0/0/0/0/0/0,week_cool=0/0/0/0/0/0/0/0/0/0/0/0/0/0
        's_dayw':        {'name': 's_dayw', 'type': 'Integer', 'writeable': false},
        'week_heat':     {'name': 'heatWeek', 'type': 'Array', 'writeable': false},
        'week_cool':     {'name': 'coolWeek', 'type': 'Array', 'writeable': false}
    },
    '/aircon/get_year_power_ex': { // ret=OK,curr_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,curr_year_cool=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_cool=0/0/0/0/0/0/0/0/0/0/0/0
        'curr_year_heat': {'name': 'heatCurrentYear', 'type': 'Array', 'writeable': false},
        'prev_year_heat': {'name': 'heatPreviousYear', 'type': 'Array', 'writeable': false},
        'curr_year_cool': {'name': 'coolCurrentYear', 'type': 'Array', 'writeable': false},
        'prev_year_cool': {'name': 'coolPreviousYear', 'type': 'Array', 'writeable': false}
    },
    '/common/set_led': {
        'led':          {'name': 'led', 'type': 'Boolean', 'required': true}
    },
    '/common/reboot': {
    },

    'response': {
        'adv':          {'name': 'adv', 'type': 'String', 'writeable': false}			// ????
    }



};


module.exports.Power = Power;
module.exports.Mode = Mode;
module.exports.FanRate = FanRate;
module.exports.FanDirection = FanDirection;
module.exports.fieldDef = fieldDef;
