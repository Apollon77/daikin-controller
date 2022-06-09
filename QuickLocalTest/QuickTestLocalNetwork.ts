import { DaikinManager } from '../src';

console.log('Starting local discovery...');
const byDiscovery: boolean = true;
if (byDiscovery) {
    new DaikinManager({
        addDevicesByDiscovery: true,
        deviceDiscoveryWaitCount: 3,
        logInitialDeviceConnection: true,
        useGetToPost: false,
        initializeCB: (message) => {
            console.log(`Initialization finished: ${message}`);
        },
    });
} else {
    new DaikinManager({
        addDevicesByDiscovery: false,
        deviceList: {
            Device1: '1.2.3.4',
            Device2: '2.3.4.5',
        },
        deviceDiscoveryWaitCount: 3,
        logInitialDeviceConnection: true,
        useGetToPost: false,
        initializeCB: (message) => {
            console.log(`Initialization finished: ${message}`);
        },
    });
}
