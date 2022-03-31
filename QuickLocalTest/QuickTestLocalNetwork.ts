import { DaikinManager } from '../src';

console.log('Starting local discovery...');
new DaikinManager({
  addDevicesByDiscovery: true,
  deviceDiscoveryWaitCount: 2,
  logIntialDeviceConnection: true,
  useGetToPost: false,
  initializeCB: (message) => {
    console.log(`Initialization finished: ${message}`);
  },
});
