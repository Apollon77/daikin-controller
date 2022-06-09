/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ControlInfo, DaikinAC } from '../src';
import nock = require('nock');;

const debug = false;
const logger = debug ? console.log : null;
const options = { logger: logger, useGetToPost: true };

describe('Test DaikinAC', function () {
  it('constructor without update', function (done) {
    const req = nock('http://127.0.0.1')
      .get('/common/basic_info')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=1,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/aircon/get_model_info?lpw=')
      .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1');
    const daikin = new DaikinAC('127.0.0.1', options, function (err) {
      expect(req.isDone()).toBeTruthy();
      expect(daikin.updateTimeout).toBeNull();
      expect(err).toBeNull();
      done();
    });
  });

  it('constructor without update but error', function (done) {
    nock('http://127.0.0.1').get('/common/basic_info').reply(200, 'ret=ADV NG,bla=1');
    new DaikinAC('127.0.0.1', options, function (err, _res) {
      expect(err).toBeInstanceOf(Error);
      expect(err?.message?.toString()).toEqual('Wrong ADV: ret=ADV NG,bla=1');
      done();
    });
  });

  it('constructor with update', function (done) {
    const req = nock('http://127.0.0.1')
      .get('/common/basic_info')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=1,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/aircon/get_model_info?lpw=')
      .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
      .get('/aircon/get_control_info?lpw=')
      .reply(
        200,
        'ret=OK,pow=0,mode=3,adv=,stemp=23.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
      )
      .get('/aircon/get_sensor_info?lpw=')
      .reply(200, 'ret=OK,htemp=21.5,hhum=-,otemp=-,err=0,cmpfreq=0')
      .get('/aircon/get_control_info?lpw=')
      .reply(
        200,
        'ret=OK,pow=0,mode=3,adv=,stemp=24.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
      )
      .get('/aircon/get_sensor_info?lpw=')
      .reply(200, 'ret=OK,htemp=22.5,hhum=-,otemp=-,err=0,cmpfreq=0');
    const daikin = new DaikinAC('127.0.0.1', options, function (err) {
      expect(err).toBeNull();
      expect(Object.keys(daikin.currentCommonBasicInfo!).length).toEqual(25);
      expect(Object.keys(daikin.currentACModelInfo!).length).toEqual(7);

      let cnt = 0;
      daikin.setUpdate(1000, function (err) {
        expect(err).toBeNull();
        expect(daikin.updateInterval).toEqual(1000);
        expect(daikin.updateTimeout).not.toBeNull();
        cnt++;
        if (cnt == 1) {
          expect(daikin.currentACControlInfo!.targetTemperature).toEqual(23);
          expect(daikin.currentACSensorInfo!.indoorTemperature).toEqual(21.5);
        } else {
          expect(cnt).toEqual(2);
          expect(daikin.currentACControlInfo!.targetTemperature).toEqual(24);
          expect(daikin.currentACSensorInfo!.indoorTemperature).toEqual(22.5);
          daikin.stopUpdate();
          expect(req.isDone()).toBeTruthy();
          expect(daikin.updateTimeout).toBeNull();
          expect(Object.keys(daikin.currentACControlInfo!).length).toEqual(42);
          expect(Object.keys(daikin.currentACSensorInfo!).length).toEqual(5);
          done();
        }
      });
    });
  });

  it('constructor and successfull setACControlInfo', function (done) {
    nock('http://127.0.0.1')
      .get('/common/basic_info')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/aircon/get_model_info')
      .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
      .get('/aircon/get_control_info')
      .reply(
        200,
        'ret=OK,pow=0,mode=3,adv=,stemp=23.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
      )
      .get(
        '/aircon/set_control_info?pow=1&mode=3&stemp=24.0&shum=0&f_rate=A&f_dir=0&adv=&dt1=25&dt2=M&dt3=23&dt4=27&dt5=27&dt7=25&dh1=AUTO&dh2=50&dh3=0&dh4=0&dh5=0&dh7=AUTO&dhh=50&dfr1=5&dfr2=5&dfr3=A&dfr4=5&dfr5=5&dfr6=5&dfr7=5&dfrh=5&dfd1=0&dfd2=0&dfd3=0&dfd4=0&dfd5=0&dfd6=0&dfd7=0&dfdh=0&b_mode=3&b_stemp=23&b_shum=0&b_f_rate=A&b_f_dir=0&alert=255',
      )
      .reply(200, 'ret=OK,adv=')
      .get('/aircon/get_control_info')
      .reply(
        200,
        'ret=OK,pow=0,mode=3,adv=,stemp=24.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
      );
    const daikin = new DaikinAC('127.0.0.1', options, function (err) {
      expect(err).toBeNull();
      const vals = {
        power: true,
        mode: 3,
        targetTemperature: 24,
        targetHumidity: 0,
      };
      daikin.setACControlInfo(vals as ControlInfo, function (err, response) {
        expect(err).toBeNull();
        expect(Object.keys(response!).length).toEqual(42);
        expect(daikin.currentACControlInfo!.targetTemperature).toEqual(24);
        expect(daikin.currentACControlInfo!.mode).toEqual(3);
        done();
      });
    });
  });
  it('constructor and failure1 setACControlInfo', function (done) {
    nock('http://127.0.0.1')
      .get('/common/basic_info')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/aircon/get_model_info')
      .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
      .get('/aircon/get_control_info')
      .reply(
        200,
        'ret=OK,pow=0,mode=2,adv=,stemp=23.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
      )
      .get(
        '/aircon/set_control_info?pow=1&mode=3&stemp=24.0&shum=0&f_rate=A&f_dir=0&adv=&dt1=25&dt2=M&dt3=23&dt4=27&dt5=27&dt7=25&dh1=AUTO&dh2=50&dh3=0&dh4=0&dh5=0&dh7=AUTO&dhh=50&dfr1=5&dfr2=5&dfr3=A&dfr4=5&dfr5=5&dfr6=5&dfr7=5&dfrh=5&dfd1=0&dfd2=0&dfd3=0&dfd4=0&dfd5=0&dfd6=0&dfd7=0&dfdh=0&b_mode=3&b_stemp=23&b_shum=0&b_f_rate=A&b_f_dir=0&alert=255',
      )
      .reply(200, 'ret=PARAM NG,adv=')
      .get('/aircon/get_control_info')
      .reply(
        200,
        'ret=OK,pow=0,mode=3,adv=,stemp=25.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
      );
    const daikin = new DaikinAC('127.0.0.1', options, function (err) {
      expect(err).toBeNull();
      const vals = {
        power: true,
        mode: 3,
        targetTemperature: 24,
        targetHumidity: 0,
      };
      daikin.setACControlInfo(vals as ControlInfo, function (err, response) {
        expect(err).toBeInstanceOf(Error);
        expect(err?.message?.toString()).toEqual('Wrong Parameters in request: ret=PARAM NG,adv=');
        expect(Object.keys(response!).length).toEqual(42);
        expect(daikin.currentACControlInfo!.targetTemperature).toEqual(25);
        expect(daikin.currentACControlInfo!.mode).toEqual(3);
        done();
      });
    });
  });

  it('constructor and all other getMethods', function (done) {
    const req = nock('http://127.0.0.1')
      .get('/common/basic_info')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=1,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/aircon/get_model_info?lpw=')
      .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
      .get('/aircon/get_remote_method?lpw=')
      .reply(200, 'ret=OK,method=home only,notice_ip_int=3600,notice_sync_int=60')
      .get('/aircon/get_sensor_info?lpw=')
      .reply(200, 'ret=OK,htemp=21.5,hhum=-,otemp=-,err=0,cmpfreq=0')
      .get('/aircon/get_model_info?lpw=')
      .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
      .get('/aircon/get_week_power?lpw=')
      .reply(200, 'ret=OK,today_runtime=24,datas=0/1/2/3/4/5/6')
      .get('/aircon/get_year_power?lpw=')
      .reply(200, 'ret=OK,previous_year=0/1/2/3/4/5/6/7/8/9/10/11,this_year=0/1/2')
      .get('/aircon/get_week_power_ex?lpw=')
      .reply(200, 'ret=OK,s_dayw=6,week_heat=0/0/0/0/0/0/0/0/0/0/0/0/0/0,week_cool=0/0/0/0/0/0/0/0/0/0/0/0/0/0')
      .get('/aircon/get_year_power_ex?lpw=')
      .reply(
        200,
        'ret=OK,curr_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,curr_year_cool=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_cool=0/0/0/0/0/0/0/0/0/0/0/0',
      )
      .get('/common/reboot?lpw=')
      .reply(200, 'ret=OK')
      .get('/common/basic_info?lpw=')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=0,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=1,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/common/set_led?lpw=&led=1')
      .reply(200, 'ret=OK')
      .get('/common/basic_info?lpw=')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=1,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      )
      .get('/common/set_led?lpw=&led=0')
      .reply(200, 'ret=OK')
      .get('/common/basic_info?lpw=')
      .reply(
        200,
        'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1',
      );
    const daikin = new DaikinAC('127.0.0.1', options, function (err) {
      expect(err).toBeNull();
      daikin.getCommonRemoteMethod(function (err, response) {
        expect(err).toBeNull();
        expect(Object.keys(response!).length).toEqual(3);
        expect(response!.method).toEqual('home only');

        daikin.getACSensorInfo(function (err, response) {
          expect(err).toBeNull();
          expect(Object.keys(response!).length).toEqual(5);
          expect(response!.indoorTemperature).toEqual(21.5);
          expect(response!.outdoorTemperature).toBeNaN();

          daikin.getACModelInfo(function (err, response) {
            expect(err).toBeNull();
            expect(Object.keys(response!).length).toEqual(7);
            expect(response!.model).toEqual('NOTSUPPORT');

            daikin.getACWeekPower(function (err, response) {
              expect(err).toBeNull();
              expect(Object.keys(response!).length).toEqual(2);
              expect(Array.isArray(response!.data)).toBeTruthy();
              expect(response?.data?.[3]).toEqual(3);

              daikin.getACYearPower(function (err, response) {
                expect(err).toBeNull();
                expect(Object.keys(response!).length).toEqual(2);
                expect(Array.isArray(response!.previousYear)).toBeTruthy();
                expect(response?.previousYear?.length).toEqual(12);
                expect(response?.previousYear?.[3]).toEqual(3);
                expect(response?.currentYear?.length).toEqual(3);
                expect(response?.currentYear?.[1]).toEqual(1);

                daikin.getACWeekPowerExtended(function (err, response) {
                  expect(err).toBeNull();
                  expect(Object.keys(response!).length).toEqual(3);
                  expect(Array.isArray(response!.heatWeek)).toBeTruthy();

                  daikin.getACYearPowerExtended(function (err, response) {
                    expect(err).toBeNull();
                    expect(Object.keys(response!).length).toEqual(4);
                    expect(Array.isArray(response!.heatCurrentYear)).toBeTruthy();

                    daikin.rebootAdapter(function (err, response) {
                      expect(err).toBeNull();
                      expect(Object.keys(response!).length).toEqual(1);
                      expect(daikin.currentCommonBasicInfo!.dst).toBeFalsy();

                      daikin.enableAdapterLED(function (err, response) {
                        expect(err).toBeNull();
                        expect(Object.keys(response!).length).toEqual(1);
                        expect(daikin.currentCommonBasicInfo!.dst).toBeTruthy();
                        expect(daikin.currentCommonBasicInfo!.led).toBeTruthy();

                        daikin.disableAdapterLED(function (err, response) {
                          expect(err).toBeNull();
                          expect(Object.keys(response!).length).toEqual(1);
                          expect(daikin.currentCommonBasicInfo!.led).toBeFalsy();

                          setTimeout(function () {
                            expect(req.isDone()).toBeTruthy();
                            done();
                          }, 500);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }, 600000);
});
