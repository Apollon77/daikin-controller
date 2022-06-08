import { DaikinAC } from './DaikinAC';
import { DaikinACOptions, Logger } from './DaikinACRequest';
import { DaikinDiscovery } from './DaikinDiscovery';

export interface DaikinManagerOptions {
  addDevicesByDiscovery?: boolean;
  deviceDiscoveryWaitCount?: number;
  // Name can be chosen individually, value should be the device IP e.g. 192.168.0.100
  deviceList?: { [name: string]: string };
  logger?: Logger;
  useGetToPost?: boolean;
  logIntialDeviceConnection: boolean;
  initializeCB?: (message: string) => void;
}

export class DaikinManager {
  public devices: { [name: string]: DaikinAC } = {};
  public daikinAcOptions: DaikinACOptions;
  public managerOptions: DaikinManagerOptions;

  public constructor(options: DaikinManagerOptions) {
    this.daikinAcOptions = { logger: options.logger, useGetToPost: options.useGetToPost };
    this.managerOptions = options;
    if (options.addDevicesByDiscovery) {
      this.startDiscovery(options.deviceDiscoveryWaitCount ?? 2);
    } else if (options.deviceList !== undefined) {
      this.addDevices(options.deviceList, options.logIntialDeviceConnection);
    } else {
      throw new Error('Created without providing device List or allowing Auto Discover');
    }
  }

  private addDevices(devices: { [name: string]: string }, logInitialDeviceConnection: boolean = false): void {
    const expectedAmount: number = Object.keys(devices).length;
    let connectedAmount: number = 0;
    let triedAmmount: number = 0;
    for (const key in devices) {
      const ip = devices[key];
      this.devices[key] = new DaikinAC(ip, this.daikinAcOptions, (err, res) => {
        if (err === null) connectedAmount++;
        if (++triedAmmount == expectedAmount) {
          this.managerOptions.initializeCB?.(
            `Finished Initialization with ${connectedAmount} connected and ${
              expectedAmount - connectedAmount
            } failed Devices.`,
          );
        }
        if (!logInitialDeviceConnection) {
          return;
        }
        if (err !== null) {
          console.log(`Initial connection to "${key}" at adress "${ip}" failed: ${err}`);
        } else {
          console.log(`Initial connection to "${key}" at adress "${ip}" succeeded: ${JSON.stringify(res)}`);
        }
      });
    }
  }

  private startDiscovery(deviceDiscoveryWaitCount: number): void {
    new DaikinDiscovery(deviceDiscoveryWaitCount, (devices) => {
      if (Object.keys(devices).length !== 0) {
        this.addDevices(devices);
        return;
      }
      this.managerOptions.initializeCB?.("Couldn't find any devices...");
    });
  }
}
