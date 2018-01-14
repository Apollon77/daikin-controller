/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var DaikinAC = require('./lib/DaikinAC');
var DaikinDiscover = require('./lib/DaikinDiscovery');

module.exports = {
	DaikinAC: DaikinAC,

    discover: DaikinDiscover
};
