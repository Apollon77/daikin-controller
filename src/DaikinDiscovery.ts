import { createSocket, Socket } from 'dgram';

// Change this to true to output debugging logs to the console
const debug = false;

export class DaikinDiscovery {
    private readonly listenAddress: string = '0.0.0.0';
    private readonly listenPort: number = 30000;
    private readonly probePort: number = 30050;
    private readonly probeAddress: string = '255.255.255.255';
    private readonly probeAttempts: number = 10;
    private readonly probeInterval: number = 500;
    private readonly probeData: Buffer = Buffer.from('DAIKIN_UDP/common/basic_info');
    private probeTimeout: NodeJS.Timeout | null = null;
    private discoveredDevices: { [address: string]: string } = {};
    private udpSocket: Socket;
    private readonly callback: (devices: { [p: string]: string }) => void;

    public constructor(waitForCount: number, callback: (devices: { [address: string]: string }) => void) {
        this.callback = callback;
        // TODO: Which parameterrs are really needed
        // TODO: Also initialize DaicinAC instances?

        this.udpSocket = createSocket({ type: 'udp4', reuseAddr: true });

        this.udpSocket.on('error', (err) => {
            this.log(`ERROR udpSocket: ${err}`);
        });

        this.udpSocket.bind(this.listenPort, this.listenAddress, () => {
            this.udpSocket.addMembership('224.0.0.1');
            this.udpSocket.setBroadcast(true);
        });

        this.udpSocket.on('message', (message, remote) => {
            this.log(`${remote.address}:${remote.port} - ${message}`);
            // this.discoveredDevices[remote.address] = message.toString();
            this.discoveredDevices[remote.address] = remote.address;
            if (Object.keys(this.discoveredDevices).length >= waitForCount) {
                this.finalizeDiscovery();
            }
        });

        this.udpSocket.on('listening', () => {
            this.sendProbes(this.probeAttempts);
        });
    }
    private sendProbes(attemptsLeft: number) {
        this.probeTimeout = null;
        if (attemptsLeft <= 0) {
            this.finalizeDiscovery();
            return;
        }
        this.log(`Send UDP discovery package ${attemptsLeft}`);
        this.udpSocket.send(this.probeData, 0, this.probeData.length, this.probePort, this.probeAddress);
        this.probeTimeout = setTimeout(this.sendProbes.bind(this), this.probeInterval, --attemptsLeft);
    }
    private finalizeDiscovery() {
        if (this.probeTimeout !== null) {
            clearTimeout(this.probeTimeout);
            this.probeTimeout = null;
        }
        this.udpSocket.close();
        this.log(`Discovery finished with ${Object.keys(this.discoveredDevices).length} devices found`);
        this.callback(this.discoveredDevices);
    }

    private log(message: string) {
        if (debug) console.log(message);
    }
}
