/* eslint-disable @typescript-eslint/no-non-null-assertion */
import nock from 'nock';
import { ControlInfo, DaikinACRequest } from '../src';

const debug = false;
const logger = debug ? console.log : null;
const options = { logger: logger };

describe('Test DaikinACTypes', () => {
  it('set_control_info Success', (done) => {
    const info = new ControlInfo();
    info.power = false;
    info.mode = 3;
    info.specialMode = '';
    info.targetTemperature = 23;
    info.targetHumidity = 0;
    info.targetTemperatureMode1 = 25;
    info.targetTemperatureMode2 = 'M';
    info.targetTemperatureMode3 = 23;
    info.targetTemperatureMode4 = 27;
    info.targetTemperatureMode5 = 27;
    info.targetTemperatureMode7 = 25;
    info.targetHumidityMode1 = 'AUTO';
    info.targetHumidityMode2 = 50;
    info.targetHumidityMode3 = 0;
    info.targetHumidityMode4 = 0;
    info.targetHumidityMode5 = 0;
    info.targetHumidityMode7 = 'AUTO';
    info.targetHumidityModeH = 50;
    info.modeB = 3;
    info.targetTemperatureB = 23;
    info.targetHumidityB = 0;
    info.error = 255;
    info.fanRate = 'A';
    info.fanDirection = 0;
    info.fanRateB = 'A';
    info.fanDirectionB = 0;
    info.fanRateMode1 = 5;
    info.fanRateMode2 = 5;
    info.fanRateMode3 = 'A';
    info.fanRateMode4 = 5;
    info.fanRateMode5 = 5;
    info.fanRateMode6 = 5;
    info.fanRateMode7 = 5;
    info.fanRateModeH = 5;
    info.fanDirectionMode1 = 0;
    info.fanDirectionMode2 = 0;
    info.fanDirectionMode3 = 0;
    info.fanDirectionMode4 = 0;
    info.fanDirectionMode5 = 0;
    info.fanDirectionMode6 = 0;
    info.fanDirectionMode7 = 0;
    info.fanDirectionModeH = 0;
    const req = nock('http://127.0.0.1')
      .post('/aircon/set_control_info', /pow=0&mode=3&stemp=23.0&shum=0&f_rate=A&f_dir=0/)
      .reply(200, 'ret=OK,adv=');
    const daikin = new DaikinACRequest('127.0.0.1', options);
    daikin.setACControlInfo(info, (err, ret, daikinResponse) => {
      //console.log(JSON.stringify(daikinResponse));
      expect(req.isDone()).toBeTruthy();
      expect(Object.keys(daikinResponse!).length).toEqual(1);
      expect(ret).toEqual('OK');
      expect(err).toBeNull();
      done();
    });
  });

  it('set_control_info Error Params', (done) => {
    const info = new ControlInfo();
    info.power = false;
    info.mode = 3;
    const daikin = new DaikinACRequest('127.0.0.1', options);
    daikin.setACControlInfo(info, (err, ret, daikinResponse) => {
      //console.log(JSON.stringify(daikinResponse));
      expect(daikinResponse).toBeNull();
      expect(ret).toBeNull();
      expect(err).toEqual('Required Field targetTemperature do not exists');
      done();
    });
  });

  it('set_control_info Error', (done) => {
    const info = new ControlInfo();
    info.power = false;
    info.mode = 3;
    info.targetTemperature = 24;
    info.targetHumidity = 0;
    const req = nock('http://127.0.0.1')
      .post('/aircon/set_control_info', /pow=0&mode=3&stemp=24.0&shum=0/)
      .reply(200, 'ret=PARAM NG,adv=');
    const daikin = new DaikinACRequest('127.0.0.1', options);
    daikin.setACControlInfo(info, (err, ret, daikinResponse) => {
      //console.log(JSON.stringify(daikinResponse));
      //console.log(JSON.stringify(err));
      expect(req.isDone()).toBeTruthy();
      expect(daikinResponse).toBeNull();
      expect(ret).toEqual('PARAM NG');
      expect(err).toEqual('Wrong Parameters in request: ret=PARAM NG,adv=');
      done();
    });
  });

  it('set_control_info Comm-Error', (done) => {
    const info = new ControlInfo();
    info.power = false;
    info.mode = 3;
    info.targetTemperature = 24;
    info.targetHumidity = 0;
    const req = nock('http://127.0.0.1')
      .post('/aircon/set_control_info', /pow=0&mode=3&stemp=24.0&shum=0/)
      .reply(500, 'Error 42');
    const daikin = new DaikinACRequest('127.0.0.1', options);
    daikin.setACControlInfo(info, (err, ret, daikinResponse) => {
      //console.log(JSON.stringify(daikinResponse));
      //console.log(JSON.stringify(err));
      expect(req.isDone()).toBeTruthy();
      expect(daikinResponse).toBeNull();
      expect(ret).toBeNull();
      expect(err).toEqual('Cannot parse response: Error 42');
      done();
    });
  });

  it('set_control_info Net-Error', (done) => {
    const info = new ControlInfo();
    info.power = false;
    info.mode = 3;
    info.targetTemperature = 24;
    info.targetHumidity = 0;
    const req = nock('http://127.0.0.1')
      .post('/aircon/set_control_info', /pow=0&mode=3&stemp=24.0&shum=0/)
      .replyWithError({ code: 'ETIMEDOUT' });
    const daikin = new DaikinACRequest('127.0.0.1', options);
    daikin.setACControlInfo(info, (err, ret, daikinResponse) => {
      //console.log(JSON.stringify(daikinResponse));
      //console.log(JSON.stringify(err));
      expect(req.isDone()).toBeTruthy();
      expect(daikinResponse).toBeNull();
      expect(ret).toBeNull();
      expect(err?.toString()).toEqual('Error occured: Error while communicating with Daikin device: ETIMEDOUT');
      done();
    });
  });
});
