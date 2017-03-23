/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/
var Daikin = require('../../index.js');

Daikin.discover(2, function(result) {
    console.log(JSON.stringify(result));
});
