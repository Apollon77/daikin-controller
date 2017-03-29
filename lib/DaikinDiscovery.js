/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jslint esversion: 6 */
var udp = require("dgram");

// TODO: Which parameterrs are really needed
// TODO: Also initialize DaicinAC instances?
function discover(waitForCount, callback) {
    var listenAddress='0.0.0.0';
    var listenPort=30000;
    var probePort=30050;
    var probeAddress='255.255.255.255';
    var probeAttempts=10;
    var probeInterval=500;
    var probeData = new Buffer('DAIKIN_UDP/common/basic_info');
    var probeTimeout;

    var discoveredDevices = {};

    var udpSocket = udp.createSocket({type:"udp4", reuseAddr:true});

    udpSocket.on('error', function (err) {
        console.log('ERROR udpSocket: ' + err);
    });

    udpSocket.bind(listenPort, listenAddress, function() {
        udpSocket.addMembership('224.0.0.1');
        udpSocket.setBroadcast(true);
    });

    udpSocket.on("message", function (message, remote) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
        discoveredDevices[remote.address] = message.toString();
        if (Object.keys(discoveredDevices).length >= waitForCount) {
            finalizeDiscovery();
        }
    });

    udpSocket.on('listening', function() {
        sendProbes(probeAttempts);
    });

    function sendProbes(attemptsLeft) {
        probeTimeout = null;
        if (attemptsLeft > 0) {
            console.log('Send UDP discovery package ' + attemptsLeft);
            udpSocket.send(probeData, 0, probeData.length, probePort, probeAddress);
            probeTimeout = setTimeout(sendProbes, probeInterval, --attemptsLeft);
        }
        else {
            finalizeDiscovery();
        }
    }

    function finalizeDiscovery() {
        if (probeTimeout) clearTimeout(probeTimeout);
        udpSocket.close();
        console.log('Discovery finished with ' + Object.keys(discoveredDevices).length + ' devices found');
        callback(discoveredDevices);
    }
}

module.exports = discover;
