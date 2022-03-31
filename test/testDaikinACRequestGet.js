/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/


const expect = require('chai').expect;
const nock = require('nock');

const {ControlInfo} = require("../lib");
const DaikinACRequest = require("../lib").DaikinACRequest;

describe('Test DaikinACTypes', function () {
  
  it('normalizeValues', function (done) {
    const info = new ControlInfo();
    info.power = false,
      info.mode = 3,
      info.ad = '',
      info.targetTemperature = 23,
      info.targetHumidity = 0,
      info.targetTemperatureMode1 = 25,
      info.targetTemperatureMode = 'M',
      info.targetTemperatureMode3 = 23,
      info.targetTemperatureMode4 = 27,
      info.targetTemperatureMode5 = 27,
      info.targetTemperatureMode7 = 25,
      info.targetHumidityMode = 'AUTO',
      info.targetHumidityMode2 = 50,
      info.targetHumidityMode3 = 0,
      info.targetHumidityMode4 = 0,
      info.targetHumidityMode5 = 0,
      info.targetHumidityMode = 'AUTO',
      info.targetHumidityModeH = 50,
      info.ModeB = 3,
      info.targetTemperatureB = 23,
      info.targetHumidityB = 0,
      info.error = 255,
      info.fanRat = 'A',
      info.fanDirection = 0,
      info.fanRate = 'A',
      info.fanDirectionB = 0,
      info.fanRateMode1 = 5,
      info.fanRateMode2 = 5,
      info.fanRateMode = 'A',
      info.fanRateMode4 = 5,
      info.fanRateMode5 = 5,
      info.fanRateMode6 = 5,
      info.fanRateMode7 = 5,
      info.fanRateModeH = 5,
      info.fanDirectionMode1 = 0,
      info.fanDirectionMode2 = 0,
      info.fanDirectionMode3 = 0,
      info.fanDirectionMode4 = 0,
      info.fanDirectionMode5 = 0,
      info.fanDirectionMode6 = 0,
      info.fanDirectionMode7 = 0,
      info.fanDirectionModeH = 0;
    const res = info.getRequestDict();
    //console.log(JSON.stringify(res));
    expect(Object.keys(res).length).to.be.equal(35);
    expect(res.pow).to.be.equal(0);
    expect(res.f_rate).to.be.equal('A');
    done();
  });
  
  it('set_control_info Success', function (done) {
      const info = new ControlInfo();
      info.power = false;
      info.mode = 3;
      info.targetTemperature = 23;
      info.targetHumidity = 0;
      info.fanRate = 'A';
      info.fanDirection = 0;
      //console.log(info.getRequestDict())
      const req = nock('http://127.0.0.1')
        .get('/aircon/set_control_info?pow=0&mode=3&stemp=23.0&shum=0&f_rate=A&f_dir=0')
        .reply(200, 'ret=OK,adv=');
      const daikin = new DaikinACRequest('127.0.0.1', {useGetToPost: true});
      daikin.setACControlInfo(info, function (err, ret, daikinResponse) {
        //console.log(JSON.stringify(daikinResponse));
        expect(req.isDone()).to.be.true;
        expect(Object.keys(daikinResponse).length).to.be.equal(1);
        expect(ret).to.be.equal('OK');
        expect(err).to.be.null;
        done();
      });
    }
  )
  ;
  
  it('set_control_info Error Params', function (done) {
    const vals = {
      'power': false,
      'mode': 3,
    };
    const daikin = new DaikinACRequest('127.0.0.1', {'useGetToPost': true});
    const res = daikin.setACControlInfo(vals, function (err, ret, daikinResponse) {
      //console.log(JSON.stringify(daikinResponse));
      expect(daikinResponse).to.be.undefined;
      expect(ret).to.be.undefined;
      expect(err).to.be.equal('Required Field stemp/targetTemperature do not exists');
      done();
    });
  });
  
  it('set_control_info Error', function (done) {
    const vals = {
      'power': false,
      'mode': 3,
      'stemp': 24,
      'shum': 0
    };
    const req = nock('http://127.0.0.1')
      .get('/aircon/set_control_info?pow=0&mode=3&stemp=24.0&shum=0')
      .reply(200, 'ret=PARAM NG,adv=');
    const daikin = new DaikinACRequest('127.0.0.1', {'useGetToPost': true});
    const res = daikin.setACControlInfo(vals, function (err, ret, daikinResponse) {
      //console.log(JSON.stringify(daikinResponse));
      //console.log(JSON.stringify(err));
      expect(req.isDone()).to.be.true;
      expect(Object.keys(daikinResponse).length).to.be.equal(1);
      expect(ret).to.be.equal('PARAM NG');
      expect(err).to.be.equal('Wrong Parameters in request: ret=PARAM NG,adv=');
      done();
    });
  });
  
  it('set_special_mode Success', function (done) {
    const vals = {
      'state': 1,
      'kind': 1
    };
    const req = nock('http://127.0.0.1')
      .get('/aircon/set_special_mode?set_spmode=1&spmode_kind=1')
      .reply(200, 'ret=OK,adv=\'2\'');
    const daikin = new DaikinACRequest('127.0.0.1', {'useGetToPost': true});
    const res = daikin.setACSpecialMode(vals, function (err, ret, daikinResponse) {
      //console.log(JSON.stringify(daikinResponse));
      expect(req.isDone()).to.be.true;
      expect(Object.keys(daikinResponse).length).to.be.equal(1);
      expect(ret).to.be.equal('OK');
      expect(err).to.be.null;
      done();
    });
  });
  
  it('set_special_mode Error', function (done) {
    const vals = {
      'state': 1
    };
    const daikin = new DaikinACRequest('127.0.0.1', {'useGetToPost': true});
    const res = daikin.setACSpecialMode(vals, function (err, ret, daikinResponse) {
      //console.log(JSON.stringify(daikinResponse));
      expect(daikinResponse).to.be.undefined;
      expect(ret).to.be.undefined;
      expect(err).to.be.equal('Required Field spmode_kind/kind do not exists');
      done();
    });
  });
  
  it('set_special_mode Error Adv', function (done) {
    const vals = {
      'state': 1,
      'kind': 1
    };
    const req = nock('http://127.0.0.1')
      .get('/aircon/set_special_mode?set_spmode=1&spmode_kind=1')
      .reply(200, 'ret=ADV NG,adv=');
    const daikin = new DaikinACRequest('127.0.0.1', {'useGetToPost': true});
    const res = daikin.setACSpecialMode(vals, function (err, ret, daikinResponse) {
      //console.log(JSON.stringify(daikinResponse));
      //console.log(JSON.stringify(err));
      expect(req.isDone()).to.be.true;
      expect(Object.keys(daikinResponse).length).to.be.equal(1);
      expect(ret).to.be.equal('ADV NG');
      expect(err).to.be.equal('Wrong ADV: ret=ADV NG,adv=');
      done();
    });
  });
});
