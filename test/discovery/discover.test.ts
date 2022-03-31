import { DaikinDiscovery } from '../../src';

describe('Test DaikinDiscovery', () => {
  it('Callback triggers', (done) => {
    new DaikinDiscovery(2, (_result) => {
      // console.log(JSON.stringify(result));
      done();
    });
  }, 10000);
});
