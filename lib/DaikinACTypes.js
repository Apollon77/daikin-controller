/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

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
	'FAN':      6
};

var SpecialModeState = {
    'OFF':  '0',
    'ON':   '1'
};

var SpecialModeKind = {
    'STREAMER': '0',    // Flash STREAMER Air-Purifier
    'POWERFUL': '1',    // POWERFUL Operation
	'ECONO':    '2'     // ECONO Operation
};

var SpecialModeResponse = {
    'N/A':                  '',
    'POWERFUL':             '2',
	'ECONO':                '12',
	'STREAMER':             '13',
    'POWERFUL/STREAMER':    '2/13',
    'ECONO/STREAMER':       '12/13'
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
	'POLLING': "polling"
};

var AdpMode = {
	'RUN': "run"
};

var fieldDef = {
    '/common/basic_info': {
        'type':         {'name': 'type', 'type': 'String', 'altValues': Type},
        'reg':          {'name': 'region', 'type': 'String'},
        'dst':          {'name': 'dst', 'type': 'Boolean'},
        'ver':          {'name': 'adapterVersion', 'type': 'String'},
        'pow':          {'name': 'power', 'type': 'Boolean', 'altValues': Power},
        'location':     {'name': 'location', 'type': 'Integer'},
        'name':         {'name': 'name', 'type': 'String'},
        'icon':         {'name': 'icon', 'type': 'Integer'},
        'method':       {'name': 'method', 'type': 'String', 'altValues': Method},
        'port':         {'name': 'port', 'type': 'Integer'},
        'id':           {'name': 'id', 'type': 'String'}, // unit identifier
        'pw':           {'name': 'password', 'type': 'String'}, // password
        'lpw_flag':     {'name': 'lpwFlag', 'type': 'Integer'},
        'pv':           {'name': 'pv', 'type': 'Integer'},
        'cpv':          {'name': 'cpv', 'type': 'Integer'},
        'cpv_minor':    {'name': 'cpvMinor', 'type': 'Integer'},
        'led':          {'name': 'led', 'type': 'Boolean'}, // status LED on or off
        'en_setzone':   {'name': 'enSetzone', 'type': 'Integer'},
        'mac':          {'name': 'macAddress', 'type': 'String'},
        'adp_mode':     {'name': 'adapterMode', 'type': 'String', 'altValues': AdpMode},
        'err':          {'name': 'error', 'type': 'Integer'},		// 255
        'en_hol':       {'name': 'enHol', 'type': 'Integer'},
        'en_grp':       {'name': 'enGroup', 'type': 'Integer'},
        'grp_name':     {'name': 'groupName', 'type': 'String'},
        'adp_kind':     {'name': 'adapterKind', 'type': 'Integer'}
    },
    '/common/get_remote_method': {
        'method':          {'name': 'method', 'type': 'String'},
        'notice_ip_int':   {'name': 'noticeIpInt', 'type': 'Integer'},
        'notice_sync_int': {'name': 'noticeSyncInt', 'type': 'Integer'}
    },
    '/aircon/get_control_info': {
        'pow':          {'name': 'power', 'type': 'Boolean', 'altValues': Power},
    	'mode':         {'name': 'mode', 'type': 'Integer', 'altValues': Mode},
    	'stemp':        {'name': 'targetTemperature', 'type': 'Float', 'altValues': {'M': 'M'}},
    	'shum':         {'name': 'targetHumidity', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// "AUTO" or Number from 0..50
    	'f_rate':       {'name': 'fanRate', 'type': 'Integer', 'altValues': FanRate},
    	'f_dir':        {'name': 'fanDirection', 'type': 'Integer', 'altValues': FanDirection},

        // the following are returned, but not set-able
        'adv':          {'name': 'specialMode', 'type': 'String', 'altValues': SpecialModeResponse},
    	'dt1':          {'name': 'targetTemperatureMode1', 'type': 'Float', 'altValues': {'M': 'M'}},		// "M" or Number 10..41
    	'dt2':          {'name': 'targetTemperatureMode2', 'type': 'Float', 'altValues': {'M': 'M'}},
    	'dt3':          {'name': 'targetTemperatureMode3', 'type': 'Float', 'altValues': {'M': 'M'}},
    	'dt4':          {'name': 'targetTemperatureMode4', 'type': 'Float', 'altValues': {'M': 'M'}},
    	'dt5':          {'name': 'targetTemperatureMode5', 'type': 'Float', 'altValues': {'M': 'M'}},
    	'dt7':          {'name': 'targetTemperatureMode7', 'type': 'Float', 'altValues': {'M': 'M'}},

    	'dh1':          {'name': 'targetHumidityMode1', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number
    	'dh2':          {'name': 'targetHumidityMode2', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number
    	'dh3':          {'name': 'targetHumidityMode3', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number
    	'dh4':          {'name': 'targetHumidityMode4', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number
    	'dh5':          {'name': 'targetHumidityMode5', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number
    	'dh7':          {'name': 'targetHumidityMode7', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number
    	'dhh':          {'name': 'targetHumidityModeH', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},		// AUTO or Number

        'dfr1':         {'name': 'fanRateMode1', 'type': 'Integer', 'altValues': FanRate},
    	'dfr2':         {'name': 'fanRateMode2', 'type': 'Integer', 'altValues': FanRate},
    	'dfr3':         {'name': 'fanRateMode3', 'type': 'Integer', 'altValues': FanRate},
    	'dfr4':         {'name': 'fanRateMode4', 'type': 'Integer', 'altValues': FanRate},
    	'dfr5':         {'name': 'fanRateMode5', 'type': 'Integer', 'altValues': FanRate},
        'dfr6':         {'name': 'fanRateMode6', 'type': 'Integer', 'altValues': FanRate},
        'dfr7':         {'name': 'fanRateMode7', 'type': 'Integer', 'altValues': FanRate},
    	'dfrh':         {'name': 'fanRateModeH', 'type': 'Integer', 'altValues': FanRate},

        'dfd1':         {'name': 'fanDirectionMode1', 'type': 'Integer', 'altValues': FanDirection},
    	'dfd2':         {'name': 'fanDirectionMode2', 'type': 'Integer', 'altValues': FanDirection},
    	'dfd3':         {'name': 'fanDirectionMode3', 'type': 'Integer', 'altValues': FanDirection},
    	'dfd4':         {'name': 'fanDirectionMode4', 'type': 'Integer', 'altValues': FanDirection},
    	'dfd5':         {'name': 'fanDirectionMode5', 'type': 'Integer', 'altValues': FanDirection},
        'dfd6':         {'name': 'fanDirectionMode6', 'type': 'Integer', 'altValues': FanDirection},
        'dfd7':         {'name': 'fanDirectionMode7', 'type': 'Integer', 'altValues': FanDirection},
    	'dfdh':         {'name': 'fanDirectionModeH', 'type': 'Integer', 'altValues': FanDirection},

    	'b_mode':       {'name': 'modeB', 'type': 'Integer', 'altValues': Mode},
    	'b_stemp':      {'name': 'targetTemperatureB', 'type': 'Float', 'altValues': {'M': 'M'}},
    	'b_shum':       {'name': 'targetHumidityB', 'type': 'Float', 'altValues': {'AUTO': 'AUTO'}},
        'b_f_rate':     {'name': 'fanRateB', 'type': 'Integer', 'altValues': FanRate},
    	'b_f_dir':      {'name': 'fanDirectionB', 'type': 'Integer', 'altValues': FanDirection},

    	'alert':        {'name': 'error', 'type': 'Integer'}		// 255
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
        'model':        {'name': 'model', 'type': 'String'},
        'type':         {'name': 'type', 'type': 'String'},
        'pv':           {'name': 'pv', 'type': 'Integer'},
        'cpv':          {'name': 'cpv', 'type': 'Integer'},
        'mid':          {'name': 'mid', 'type': 'String'},
        's_fdir':       {'name': 'sFanDirection', 'type': 'Integer', 'altValues': FanDirection},
        'en_scdltmr':   {'name': 'enScdltmr', 'type': 'Integer'}
    },
    '/aircon/get_sensor_info': { // ret=OK,htemp=21.5,hhum=-,otemp=-,err=0,cmpfreq=0
        'htemp':        {'name': 'indoorTemperature', 'type': 'Float'},
        'hhum':         {'name': 'indoorHumidity', 'type': 'Float'},
        'otemp':        {'name': 'outdoorTemperature', 'type': 'Float'},
        'err':          {'name': 'error', 'type': 'Integer'},
        'cmpfreq':      {'name': 'cmpfreq', 'type': 'Integer'}
    },
    '/aircon/get_week_power': { // ret=OK,today_runtime=24,datas=0/0/0/0/0/0/0
        'today_runtime': {'name': 'todayRuntime', 'type': 'Integer'},
        'datas':         {'name': 'data', 'type': 'Array'}
    },
    '/aircon/get_year_power': { // ret=OK,previous_year=0/0/0/0/0/0/0/0/0/0/0/0,this_year=0/0/0
        'previous_year': {'name': 'previousYear', 'type': 'Array'},
        'this_year':     {'name': 'currentYear', 'type': 'Array'}
    },
    '/aircon/get_week_power_ex': { // ret=OK,s_dayw=6,week_heat=0/0/0/0/0/0/0/0/0/0/0/0/0/0,week_cool=0/0/0/0/0/0/0/0/0/0/0/0/0/0
        's_dayw':        {'name': 'sDayw', 'type': 'Integer'},
        'week_heat':     {'name': 'heatWeek', 'type': 'Array'},
        'week_cool':     {'name': 'coolWeek', 'type': 'Array'}
    },
    '/aircon/get_year_power_ex': { // ret=OK,curr_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,curr_year_cool=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_cool=0/0/0/0/0/0/0/0/0/0/0/0
        'curr_year_heat': {'name': 'heatCurrentYear', 'type': 'Array'},
        'prev_year_heat': {'name': 'heatPreviousYear', 'type': 'Array'},
        'curr_year_cool': {'name': 'coolCurrentYear', 'type': 'Array'},
        'prev_year_cool': {'name': 'coolPreviousYear', 'type': 'Array'}
    },
    '/aircon/set_special_mode': {
        'set_spmode':     {'name': 'state', 'type': 'Integer', 'altValues': SpecialModeState, 'min': 0, 'max': 1,'required': true},
        'spmode_kind':     {'name': 'kind', 'type': 'Integer', 'altValues': SpecialModeKind, 'min': 0, 'max': 2, 'required': true}
    },
    '/common/set_led': {
        'led':          {'name': 'led', 'type': 'Boolean', 'altValues': Power, 'required': true}
    },
    '/common/reboot': {
    },

    'response': {
        'adv':          {'name': 'specialMode', 'type': 'String', 'altValues': SpecialModeResponse}
    }



};


module.exports.Power = Power;
module.exports.Mode = Mode;
module.exports.FanRate = FanRate;
module.exports.FanDirection = FanDirection;
module.exports.SpecialModeState = SpecialModeState;
module.exports.SpecialModeKind = SpecialModeKind;
module.exports.SpecialModeResponse = SpecialModeResponse;
module.exports.fieldDef = fieldDef;
