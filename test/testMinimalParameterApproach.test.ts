/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ControlInfo, DaikinAC } from '../src';
import nock = require('nock');

const logger = null;
const options = { logger: logger };

describe('Test Minimal Parameter Approach', () => {
    it('should successfully use minimal parameter approach when device accepts it', (done) => {
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
            // Minimal parameter request succeeds
            .post('/aircon/set_control_info', /pow=1&mode=3&stemp=20.0&shum=0$/)
            .reply(200, 'ret=OK,adv=')
            .get('/aircon/get_control_info')
            .reply(
                200,
                'ret=OK,pow=1,mode=3,adv=,stemp=20.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
            );

        const daikin = new DaikinAC('127.0.0.1', options, function (err) {
            expect(err).toBeNull();
            const vals = {
                power: true,
                targetTemperature: 20,
            };
            daikin.setACControlInfo(vals as ControlInfo, function (err, response) {
                expect(err).toBeNull();
                expect(response).not.toBeNull();
                expect(daikin.currentACControlInfo).not.toBeNull();
                expect(daikin.currentACControlInfo!.power).toBe(true);
                expect(daikin.currentACControlInfo!.targetTemperature).toEqual(20);
                done();
            });
        });
    });

    it('should fallback to full parameters when minimal approach fails with PARAM NG', (done) => {
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
            // Minimal parameter request fails with PARAM NG
            .post('/aircon/set_control_info', /pow=1&mode=3&stemp=20.0&shum=0$/)
            .reply(200, 'ret=PARAM NG,adv=')
            // Fallback to full parameters succeeds
            .post('/aircon/set_control_info', /pow=1&mode=3&stemp=20.0&shum=0&f_rate=A&f_dir=0/)
            .reply(200, 'ret=OK,adv=')
            .get('/aircon/get_control_info')
            .reply(
                200,
                'ret=OK,pow=1,mode=3,adv=,stemp=20.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=A,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
            );

        const daikin = new DaikinAC('127.0.0.1', options, function (err) {
            expect(err).toBeNull();
            const vals = {
                power: true,
                targetTemperature: 20,
            };
            daikin.setACControlInfo(vals as ControlInfo, function (err, response) {
                expect(err).toBeNull();
                expect(response).not.toBeNull();
                expect(daikin.currentACControlInfo).not.toBeNull();
                expect(daikin.currentACControlInfo!.power).toBe(true);
                expect(daikin.currentACControlInfo!.targetTemperature).toEqual(20);
                done();
            });
        });
    });

    it('should include changed optional parameters in minimal request', (done) => {
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
            // Minimal parameters + changed fanRate
            .post('/aircon/set_control_info', /pow=1&mode=3&stemp=20.0&shum=0&f_rate=5$/)
            .reply(200, 'ret=OK,adv=')
            .get('/aircon/get_control_info')
            .reply(
                200,
                'ret=OK,pow=1,mode=3,adv=,stemp=20.0,shum=0,dt1=25.0,dt2=M,dt3=23.0,dt4=27.0,dt5=27.0,dt7=25.0,dh1=AUTO,dh2=50,dh3=0,dh4=0,dh5=0,dh7=AUTO,dhh=50,b_mode=3,b_stemp=23.0,b_shum=0,alert=255,f_rate=5,f_dir=0,b_f_rate=A,b_f_dir=0,dfr1=5,dfr2=5,dfr3=A,dfr4=5,dfr5=5,dfr6=5,dfr7=5,dfrh=5,dfd1=0,dfd2=0,dfd3=0,dfd4=0,dfd5=0,dfd6=0,dfd7=0,dfdh=0',
            );

        const daikin = new DaikinAC('127.0.0.1', options, function (err) {
            expect(err).toBeNull();
            const vals = {
                power: true,
                targetTemperature: 20,
                fanRate: 5, // This should be included in minimal request
            };
            daikin.setACControlInfo(vals as ControlInfo, function (err, response) {
                expect(err).toBeNull();
                expect(response).not.toBeNull();
                expect(daikin.currentACControlInfo).not.toBeNull();
                expect(daikin.currentACControlInfo!.power).toBe(true);
                expect(daikin.currentACControlInfo!.targetTemperature).toEqual(20);
                expect(daikin.currentACControlInfo!.fanRate).toEqual(5);
                done();
            });
        });
    });
});
