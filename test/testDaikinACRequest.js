/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/


var expect = require('chai').expect;
var nock = require('nock');

var DaikinACRequest = require('../lib/DaikinACRequest');

describe('Test DaikinACTypes', function() {

    it('normalizeValues', function (done) {
        var vals = {
            'power': false,
            'mode': 3,
            'adv': '',
            'targetTemperature': 23,
            'targetHumidity': 0,
            'targetTemperatureMode1': 25,
            'targetTemperatureMode2': 'M',
            'targetTemperatureMode3': 23,
            'targetTemperatureMode4': 27,
            'targetTemperatureMode5': 27,
            'targetTemperatureMode7': 25,
            'targetHumidityMode1': 'AUTO',
            'targetHumidityMode2': 50,
            'targetHumidityMode3': 0,
            'targetHumidityMode4': 0,
            'targetHumidityMode5': 0,
            'targetHumidityMode7': 'AUTO',
            'targetHumidityModeH': 50,
            'ModeB': 3,
            'targetTemperatureB': 23,
            'targetHumidityB': 0,
            'error': 255,
            'fanRate': 'A',
            'fanDirection': 0,
            'fanRateB': 'A',
            'fanDirectionB': 0,
            'fanRateMode1': 5,
            'fanRateMode2': 5,
            'fanRateMode3': 'A',
            'fanRateMode4': 5,
            'fanRateMode5': 5,
            'fanRateMode6': 5,
            'fanRateMode7': 5,
            'fanRateModeH': 5,
            'fanDirectionMode1': 0,
            'fanDirectionMode2': 0,
            'fanDirectionMode3': 0,
            'fanDirectionMode4': 0,
            'fanDirectionMode5': 0,
            'fanDirectionMode6': 0,
            'fanDirectionMode7': 0,
            'fanDirectionModeH': 0
        };
        var req = new DaikinACRequest();
        var res = req.normalizeValues(vals,'/aircon/set_control_info');
        //console.log(JSON.stringify(res));
        expect(Object.keys(res).length).to.be.equal(6);
        expect(res.pow).to.be.equal(0);
        expect(res.f_rate).to.be.equal('A');
        done();
    });

    it('set_control_info Success', function (done) {
        var vals = {
            'power': false,
            'mode': 3,
            'adv': '',
            'targetTemperature': 23,
            'targetHumidity': 0,
            'targetTemperatureMode1': 25,
            'targetTemperatureMode2': 'M',
            'targetTemperatureMode3': 23,
            'targetTemperatureMode4': 27,
            'targetTemperatureMode5': 27,
            'targetTemperatureMode7': 25,
            'targetHumidityMode1': 'AUTO',
            'targetHumidityMode2': 50,
            'targetHumidityMode3': 0,
            'targetHumidityMode4': 0,
            'targetHumidityMode5': 0,
            'targetHumidityMode7': 'AUTO',
            'targetHumidityModeH': 50,
            'ModeB': 3,
            'targetTemperatureB': 23,
            'targetHumidityB': 0,
            'error': 255,
            'fanRate': 'A',
            'fanDirection': 0,
            'fanRateB': 'A',
            'fanDirectionB': 0,
            'fanRateMode1': 5,
            'fanRateMode2': 5,
            'fanRateMode3': 'A',
            'fanRateMode4': 5,
            'fanRateMode5': 5,
            'fanRateMode6': 5,
            'fanRateMode7': 5,
            'fanRateModeH': 5,
            'fanDirectionMode1': 0,
            'fanDirectionMode2': 0,
            'fanDirectionMode3': 0,
            'fanDirectionMode4': 0,
            'fanDirectionMode5': 0,
            'fanDirectionMode6': 0,
            'fanDirectionMode7': 0,
            'fanDirectionModeH': 0
        };
        var req =   nock('http://127.0.0.1')
                    .post('/aircon/set_control_info', /pow=0&mode=3&stemp=23.0&shum=0&f_rate=A&f_dir=0/)
                    .reply(200, 'ret=OK,adv=');
        var daikin = new DaikinACRequest('127.0.0.1');
        var res = daikin.setACControlInfo(vals, function(err, ret, daikinResponse) {
            //console.log(JSON.stringify(daikinResponse));
            expect(req.isDone()).to.be.true;
            expect(Object.keys(daikinResponse).length).to.be.equal(1);
            expect(ret).to.be.equal('OK');
            expect(err).to.be.null;
            done();
        });
    });

    it('set_control_info Error Params', function (done) {
        var vals = {
            'power': false,
            'mode': 3,
        };
        var daikin = new DaikinACRequest('127.0.0.1');
        var res = daikin.setACControlInfo(vals, function(err, ret, daikinResponse) {
            //console.log(JSON.stringify(daikinResponse));
            expect(daikinResponse).to.be.undefined;
            expect(ret).to.be.undefined;
            expect(err).to.be.equal('Required Field stemp/targetTemperature do not exists');
            done();
        });
    });

    it('set_control_info Error', function (done) {
        var vals = {
            'power': false,
            'mode': 3,
            'stemp': 24,
            'shum': 0
        };
        var req =   nock('http://127.0.0.1')
                    .post('/aircon/set_control_info', /pow=0&mode=3&stemp=24.0&shum=0/)
                    .reply(200, 'ret=PARAM NG,adv=');
        var daikin = new DaikinACRequest('127.0.0.1');
        var res = daikin.setACControlInfo(vals, function(err, ret, daikinResponse) {
            //console.log(JSON.stringify(daikinResponse));
            //console.log(JSON.stringify(err));
            expect(req.isDone()).to.be.true;
            expect(Object.keys(daikinResponse).length).to.be.equal(1);
            expect(ret).to.be.equal('PARAM NG');
            expect(err).to.be.equal('Wrong Parameters in request: ret=PARAM NG,adv=');
            done();
        });
    });

    it('set_control_info Comm-Error', function (done) {
        var vals = {
            'power': false,
            'mode': 3,
            'stemp': 24,
            'shum': 0
        };
        var req =   nock('http://127.0.0.1')
                    .post('/aircon/set_control_info', /pow=0&mode=3&stemp=24.0&shum=0/)
                    .reply(500, 'Error 42');
        var daikin = new DaikinACRequest('127.0.0.1');
        var res = daikin.setACControlInfo(vals, function(err, ret, daikinResponse) {
            //console.log(JSON.stringify(daikinResponse));
            //console.log(JSON.stringify(err));
            expect(req.isDone()).to.be.true;
            expect(daikinResponse).to.be.null;
            expect(ret).to.be.null;
            expect(err).to.be.equal('Cannot parse response: Error 42');
            done();
        });
    });

    it('set_control_info Net-Error', function (done) {
        var vals = {
            'power': false,
            'mode': 3,
            'stemp': 24,
            'shum': 0
        };
        var req =   nock('http://127.0.0.1')
                    .post('/aircon/set_control_info', /pow=0&mode=3&stemp=24.0&shum=0/)
                    .replyWithError({code: 'ETIMEDOUT'});
        var daikin = new DaikinACRequest('127.0.0.1');
        var res = daikin.setACControlInfo(vals, function(err, ret, daikinResponse) {
            //console.log(JSON.stringify(daikinResponse));
            //console.log(JSON.stringify(err));
            expect(req.isDone()).to.be.true;
            expect(daikinResponse).to.be.null;
            expect(ret).to.be.null;
            expect(err.toString()).to.be.equal('Error: Error while communicating with Daikin device: ETIMEDOUT');
            done();
        });
    });

});
