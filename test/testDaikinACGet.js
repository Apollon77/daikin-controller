/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/

var expect = require('chai').expect;
var nock = require('nock');

var DaikinAC = require('../lib/DaikinAC');

var logger = null;
//logger = console.log;
var options = {'logger': logger, 'useGetToPost': true};

describe('Test DaikinAC', function() {

    it('constructor without update', function (done) {
        var req =   nock('http://127.0.0.1')
                    .get('/common/basic_info')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=1,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
                    .get('/aircon/get_model_info?lpw=')
                    .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1');
        var daikin = new DaikinAC('127.0.0.1', options, function(err, res) {
            expect(req.isDone()).to.be.true;
            expect(daikin.updateTimeout).to.be.null;
            expect(err).to.be.null;
            done();
        });
    });

    it('constructor without update but error', function (done) {
        var req =   nock('http://127.0.0.1')
                    .get('/common/basic_info')
                    .reply(200, 'ret=ADV NG,bla=1');
        var daikin = new DaikinAC('127.0.0.1', options, function (err, res) {
            expect(err).to.be.equal('Wrong ADV: ret=ADV NG,bla=1');
            done();
        });
    });

    it('constructor with update', function (done) {
        var req =   nock('http://127.0.0.1')
                    .get('/common/basic_info')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=1,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
                    .get('/aircon/get_model_info?lpw=')
                    .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
                    .get('/aircon/get_control_info?lpw=')
                    .reply(200, 'ret=OK,pow=0,mode=3,adv=,stemp=23.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0')
                    .get('/aircon/get_sensor_info?lpw=')
                    .reply(200, 'ret=OK,htemp=21.5,hhum=-,otemp=-,err=0,cmpfreq=0')
                    .get('/aircon/get_control_info?lpw=')
                    .reply(200, 'ret=OK,pow=0,mode=3,adv=,stemp=24.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0')
                    .get('/aircon/get_sensor_info?lpw=')
                    .reply(200, 'ret=OK,htemp=22.5,hhum=-,otemp=-,err=0,cmpfreq=0');
        var daikin = new DaikinAC('127.0.0.1', options, function(err) {
            expect(err).to.be.null;
            expect(Object.keys(daikin.currentCommonBasicInfo).length).to.be.equal(25);
            expect(Object.keys(daikin.currentACModelInfo).length).to.be.equal(7);

            var cnt = 0;
            daikin.setUpdate(1000, function(err) {
                expect(err).to.be.null;
                expect(daikin.updateInterval).equal(1000);
                expect(daikin.updateTimeout).not.to.be.null;
                cnt++;
                if (cnt == 1) {
                    expect(daikin.currentACControlInfo.targetTemperature).to.be.equal(23);
                    expect(daikin.currentACSensorInfo.indoorTemperature).to.be.equal(21.5);
                }
                else {
                    expect(cnt).to.be.equal(2);
                    expect(daikin.currentACControlInfo.targetTemperature).to.be.equal(24);
                    expect(daikin.currentACSensorInfo.indoorTemperature).to.be.equal(22.5);
                    daikin.stopUpdate();
                    expect(req.isDone()).to.be.true;
                    expect(daikin.updateTimeout).to.be.null;
                    expect(Object.keys(daikin.currentACControlInfo).length).to.be.equal(42);
                    expect(Object.keys(daikin.currentACSensorInfo).length).to.be.equal(5);
                    done();
                }
            });
        });
    });

    it('constructor and successfull setACControlInfo', function (done) {
        var req =   nock('http://127.0.0.1')
                    .get('/common/basic_info')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
                    .get('/aircon/get_model_info')
                    .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
                    .get('/aircon/get_control_info')
                    .reply(200, 'ret=OK,pow=0,mode=3,adv=,stemp=23.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0')
                    .get('/aircon/set_control_info?pow=1&mode=3&stemp=24.0&shum=0&f_rate=A&f_dir=0')
                    .reply(200, 'ret=OK,adv=')
                    .get('/aircon/get_control_info')
                    .reply(200, 'ret=OK,pow=0,mode=3,adv=,stemp=24.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0');
        var daikin = new DaikinAC('127.0.0.1', options, function(err) {
            expect(err).to.be.null;
            var vals = {
                'power': true,
                'mode': 3,
                'targetTemperature': 24,
                'targetHumidity': 0
            };
            daikin.setACControlInfo(vals, function(err, response) {
                expect(err).to.be.null;
                expect(Object.keys(response).length).to.be.equal(42);
                expect(daikin.currentACControlInfo.targetTemperature).to.be.equal(24);
                expect(daikin.currentACControlInfo.mode).to.be.equal(3);
                done();
            });
        });
    });
    it('constructor and failure1 setACControlInfo', function (done) {
        var req =   nock('http://127.0.0.1')
                    .get('/common/basic_info')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
                    .get('/aircon/get_model_info')
                    .reply(200, 'ret=OK,model=NOTSUPPORT,type=N,pv=0,cpv=0,mid=NA,s_fdir=1,en_scdltmr=1')
                    .get('/aircon/get_control_info')
                    .reply(200, 'ret=OK,pow=0,mode=2,adv=,stemp=23.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0')
                    .get('/aircon/set_control_info?pow=1&mode=3&stemp=24.0&shum=0&f_rate=A&f_dir=0')
                    .reply(200, 'ret=PARAM NG,adv=')
                    .get('/aircon/get_control_info')
                    .reply(200, 'ret=OK,pow=0,mode=3,adv=,stemp=25.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0');
        var daikin = new DaikinAC('127.0.0.1', options, function(err) {
            expect(err).to.be.null;
            var vals = {
                'power': true,
                'mode': 3,
                'targetTemperature': 24,
                'targetHumidity': 0
            };
            daikin.setACControlInfo(vals, function(err, response) {
                expect(err).to.be.equal('Wrong Parameters in request: ret=PARAM NG,adv=');
                expect(Object.keys(response).length).to.be.equal(42);
                expect(daikin.currentACControlInfo.targetTemperature).to.be.equal(25);
                expect(daikin.currentACControlInfo.mode).to.be.equal(3);
                done();
            });
        });
    });


    it('constructor and all other getMethods', function (done) {
        this.timeout(600000); // because of first install from npm

        var req =   nock('http://127.0.0.1')
                    .get('/common/basic_info')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=1,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
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
                    .reply(200, 'ret=OK,curr_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_heat=0/0/0/0/0/0/0/0/0/0/0/0,curr_year_cool=0/0/0/0/0/0/0/0/0/0/0/0,prev_year_cool=0/0/0/0/0/0/0/0/0/0/0/0')
                    .get('/common/reboot?lpw=')
                    .reply(200, 'ret=OK')
                    .get('/common/basic_info?lpw=')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=0,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=1,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
                    .get('/common/set_led?lpw=&led=1')
                    .reply(200, 'ret=OK')
                    .get('/common/basic_info?lpw=')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=1,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1')
                    .get('/common/set_led?lpw=&led=0')
                    .reply(200, 'ret=OK')
                    .get('/common/basic_info?lpw=')
                    .reply(200, 'ret=OK,type=aircon,reg=eu,dst=1,ver=2_6_0,pow=0,err=0,location=0,name=%4b%6c%69%6d%61%20%4a%61%6e%61,icon=0,method=home only,port=30050,id=,pw=,lpw_flag=0,adp_kind=2,pv=0,cpv=0,cpv_minor=00,led=0,en_setzone=1,mac=A408EACC91D4,adp_mode=run,en_hol=0,grp_name=%4b%69%6e%64%65%72,en_grp=1');
        var daikin = new DaikinAC('127.0.0.1', options, function(err) {
            expect(err).to.be.null;
            daikin.getCommonRemoteMethod(function(err, response) {
                expect(err).to.be.null;
                expect(Object.keys(response).length).to.be.equal(3);
                expect(response.method).to.be.equal('home only');

                daikin.getACSensorInfo(function(err, response) {
                    expect(err).to.be.null;
                    expect(Object.keys(response).length).to.be.equal(5);
                    expect(response.indoorTemperature).to.be.equal(21.5);
                    expect(response.outdoorTemperature).to.be.NaN;

                    daikin.getACModelInfo(function(rerr, response) {
                        expect(err).to.be.null;
                        expect(Object.keys(response).length).to.be.equal(7);
                        expect(response.model).to.be.equal('NOTSUPPORT');

                        daikin.getACWeekPower(function(err, response) {
                            expect(err).to.be.null;
                            expect(Object.keys(response).length).to.be.equal(2);
                            expect(response.data).to.be.an('array');
                            expect(response.data[3]).to.be.equal(3);

                            daikin.getACYearPower(function(err, response) {
                                expect(err).to.be.null;
                                expect(Object.keys(response).length).to.be.equal(2);
                                expect(response.previousYear).to.be.an('array');
                                expect(response.previousYear.length).to.be.equal(12);
                                expect(response.previousYear[3]).to.be.equal(3);
                                expect(response.currentYear.length).to.be.equal(3);
                                expect(response.currentYear[1]).to.be.equal(1);

                                daikin.getACWeekPowerExtended(function(err, response) {
                                    expect(err).to.be.null;
                                    expect(Object.keys(response).length).to.be.equal(3);
                                    expect(response.heatWeek).to.be.an('array');

                                    daikin.getACYearPowerExtended(function(err, response) {
                                        expect(err).to.be.null;
                                        expect(Object.keys(response).length).to.be.equal(4);
                                        expect(response.heatCurrentYear).to.be.an('array');

                                        daikin.rebootAdapter(function(err, response) {
                                            expect(err).to.be.null;
                                            expect(Object.keys(response).length).to.be.equal(0);
                                            expect(daikin.currentCommonBasicInfo.dst).to.be.false;

                                            daikin.enableAdapterLED(function(err, response) {
                                                expect(err).to.be.null;
                                                expect(Object.keys(response).length).to.be.equal(0);
                                                expect(daikin.currentCommonBasicInfo.dst).to.be.true;
                                                expect(daikin.currentCommonBasicInfo.led).to.be.true;

                                                daikin.disableAdapterLED(function(err, response) {
                                                    expect(err).to.be.null;
                                                    expect(Object.keys(response).length).to.be.equal(0);
                                                    expect(daikin.currentCommonBasicInfo.led).to.be.false;

                                                    setTimeout(function() {
                                                        expect(req.isDone()).to.be.true;
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
    });

});
