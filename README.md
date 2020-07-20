# daikin-controller

[![Greenkeeper badge](https://badges.greenkeeper.io/Apollon77/daikin-controller.svg)](https://greenkeeper.io/)
[![NPM version](http://img.shields.io/npm/v/daikin-controller.svg)](https://www.npmjs.com/package/daikin-controller)
[![Downloads](https://img.shields.io/npm/dm/daikin-controller.svg)](https://www.npmjs.com/package/daikin-controller)
[![Code Climate](https://codeclimate.com/github/Apollon77/daikin-controller/badges/gpa.svg)](https://codeclimate.com/github/Apollon77/daikin-controller)

**Tests:**
[![Test Coverage](https://codeclimate.com/github/Apollon77/daikin-controller/badges/coverage.svg)](https://codeclimate.com/github/Apollon77/daikin-controller/coverage)
Linux/Mac:
[![Travis-CI](http://img.shields.io/travis/Apollon77/daikin-controller/master.svg)](https://travis-ci.org/Apollon77/daikin-controller)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/Apollon77/daikin-controller?branch=master&svg=true)](https://ci.appveyor.com/project/Apollon77/daikin-controller/)

[![NPM](https://nodei.co/npm/daikin-controller.png?downloads=true)](https://nodei.co/npm/daikin-controller/)

This library connects to a Daikin Air Conditioner device and allows to control the device and to read values from it.
The Daikin Device needs to be equipped with a Daikin Wifi controller. Normally all wifi controllers should be supportedthat are supported by the Daikin App.

**Device series from 2019**
| wireless adapter | device name | device series | test result |
| --- | --- | --- | --- |
| BRP069B42 | Urura Sarara | FTXZ-N | not tested, but should work (with 'useGetToPost')  |
| BRP084A42-1 | Stylish | CTXA-A*; FTXA-A*; FTXA-B* | works with 'useGetToPost' |
| BRP069B41 | Emura | FTXJ-M* | works with 'useGetToPost' |
| BRP069B41 | Perfera | CTXM-N; FTXM-N | works with 'useGetToPost' |
| BRP069B45 | Comfora | FTXP-M | works with 'useGetToPost' |
| BRP069B45 | Sensira (Austria) | FTXF-A | works with 'useGetToPost' |
| BRP069B45 | Siesta (Germany) | ATXF-A | not tested, but should work (with 'useGetToPost') |

(*) is a placeholder for color of device (example: FTXA20AW ... "W" = White);
(-) is a placeholder for cooling performance, as an approximate value (example: FTXA20AW … "20" = 2,0 kW);

What is meant by "with 'useGetToPost'":
```
var options = {'useGetToPost':true};

var daikin = new DaikinAC('192.168.0.100', options, function(err) {
    ...
```

**Device series until 2019**
According to Daikin Support Documents the following devices should be compatible (at least):

Compatible units in combination with BRP069A41:
FTXG20LV1BW, FTXG20LV1BS , FTXG25LV1BW, FTXG25LV1BS, FTXG35LV1BW, FTXG35LV1BS, FTXG50LV1BW, FTXG50LV1BS,
FTXJ20LV1BW, FTXJ20LV1BS, FTXJ25LV1BW, FTXJ25LV1BS, FTXJ35LV1BW, FTXJ35LV1BS, FTXJ50LV1BW, FTXJ50LV1BS ,

Compatible units in combination with BRP069A42:
FTXZ25NV1B, FTXZ35NV1B, FTXZ50NV1B, FTXS35K2V1B, FTXS35K3V1B, FTXS42K2V1B, FTXS42K3V1B, FTXS50K2V1B,
FTXS50K3V1B, FTXLS25K2V1B, FTXLS35K2V1B,FTXM35K3V1B, FTXM42K3V1B, FTXM50K3V1B, , FTXS60GV1B, FTXS71GV1B,
ATXS35K2V1B, ATXS35K3V1B, ATXS50K2V1B, ATXS50K3V1B, , FTX50GV1B, FTX60GV1B, FTX71GV1B, , FVXG25K2V1B,
FVXG35K2V1B, FVXG50K2V1B, , FVXS25FV1B, FVXS35FV1B, FVXS50FV1B, , FLXS25BAVMB, FLXS25BVMA, FLXS25BVMB,
FLXS35BAVMB, FLXS35BAVMB9, FLXS35BVMA, FLXS35BVMB, FLXS50BAVMB, FLXS50BVMA, FLXS50BVMB, FLXS60BAVMB,
FLXS60BVMA, FLXS60BVMB,

Compatible units in combination with BRP069A43 (?):
CTXS15K2V1B, CTXS15K3V1B, FTXS20K2V1B, FTXS20K3V1B, FTXS25K2V1B, FTXS25K3V1B, CTXS35K2V1B, CTXS35K3V1B,
FTXM20K3V1B, FTXM25K3V1B, , ATXS20K2V1B, ATXS20K3V1B, ATXS25K2V1B, ATXS25K3V1B, , FTX20J2V1B, FTX25J2V1B,
FTX35J2V1B, FTX20J3V1B, FTX25J3V1B, FTX35J3V1B, , FTXL25J2V1B, FTXL35J2V1B, , FTX20KV1B, FTX25KV1B, FTX35KV1B,
FTX20GV1B, FTX25GV1B, FTX35GV1B, , ATX20J2V1B, ATX20J3V1B, ATX25J2V1B, ATX25J3V1B, ATX35J2V1B, ATX35J3V1B,
ATX20KV1B, ATX25KV1B, ATX35KV1B, , ATXL25J2V1B, ATXL35J2V1B,

Compatible units in combination with BRP069A44 (?):
FTX50KV1B, FTX60KV1B

The library is based on the great work of the unofficial Daikin API documentation project (https://github.com/ael-code/daikin-control). Additional informations on parameters and values can be found there.

## Usage example

```
var options = {'logger': console.log}; // optional logger method to get debug logging

var daikin = new DaikinAC('192.168.0.100', options, function(err) {
    // will be called after successfull initialization

    // daikin.currentCommonBasicInfo - contains automatically requested basic device data
    // daikin.currentACModelInfo - contains automatically requested device model data

    daikin.setUpdate(1000, function(err) {
        // method to call after each update
        // daikin.currentACControlInfo - contains control data from device updated on defined interval
        // daikin.currentACSensorInfo - contains sensor data from device updated on defined interval
    });

});
```
## Usage informations
The library tries to make it easy to interact with a Daikin device, especially by caching the last read values as seen in the example above. These values can also be queried manually, but the library makes sure that the cached data are always current - this means that after changing some of the settings the relevant data are updated too.

On each call the result will be provided to a callback method together with an error flag containing an error message.

The library do not return the same field names as the Device (as listed on the unofficial documentation), but tries to make the fields more human readable in camel case notation together with type conversion where possible. The corresponding mapping can be found in lib/DaikinACTypes.js .

The callback method should have aa signature like

```
function (err, ret, response)
```
* **err**: null on success or a string value when an error has occured
* **ret**: The return value from the device. Can currently be "OK", "PARAM NG" (Wrong Parameters) or "ADV NG" (Wrong ADV)
* **response**: Object that contains the returned fields as keys. Mapping from device fieldnames to library field names see lib/DaikinACTypes.js

## Manuals

* [Node-RED (Linux)](docs/node-red/linux.md)

## Method description

### DaikinAC(ip, options, callback)
Constructor to initialize the Daikin instance to interact with the device.
Usage see example above, the "options" paraeter is optional. Using "options" you can set a **logger** function (see example). Additionally you can set the special flag **useGetToPost** for older Firmwares of the Daikin-WLAN-Interfaces (<1.4) that only supported HTTP GET also to set data. So if you get errors using it then you try if it works better with this flag.
The callback function is called after initializing the device and requesting currentCommonBasicInfo and currentACModelInfo.

### setUpdate(updateInterval, callback)
Use this method to initialize polling to get currentACControlInfo and currentACSensorInfo filled on the given interval. The interval is given in ms.
The callback function is called **after each polling/update**.

### updateData()
This method is mainly used internally to update the data, but can also be used to update the data in between of the pollings.
On result the callback from "setUpdate" is called, else only values are updated.

### stopUpdate()
End the auto-update and clear all polling timeouts.

### getCommonBasicInfo(callback)
Get the "Basic-Info" details from the Daikin-Device. The callback will be called with the result.

### getCommonRemoteMethod(callback)
Get the "Remote Method" details from the Daikin-Device. The callback will be called with the result.

### getACControlInfo(callback)
Get the "Control-Info" details from the Daikin-Device. The callback will be called with the result.

### setACControlInfo(values, callback)
Send an update for the "Control-Info" data to the device. values is an object with the following possible keys:
* power: Boolean, enable or disable the device, you can also use DaikinAC-Power for allowed values in human readable format
* mode: Integer, set operation Mode of the device, you can also use DaikinAC-Mode for allowed values in human readable format
* targetTemperature: Float or "M" for mode 2 (DEHUMDIFICATOR)
* targetHumidity: Float or "AUTO"/"--" for mode 6 (FAN)
* fanRate: Integer or "A"/"B", you can also use DaikinAC-FanRate for allowed values in human readable format
* fanDirection: Integer, you can also use DaikinAC-FanDirection for allowed values in human readable format

You can also set single of those keys (e.g. only "Power=true"). When this happends the current data are requested from the device, the relevant values will be changed and all required fields will be re-send to the device. Be carefull, especially on mode changes some values may be needed to be correct (e.g. when changing back from "FAN" to "AUTO" then temperature is empty too, but Auto needs a set temperature).

### getACSensorInfo(callback)
Get the "Sensor-Info" details from the Daikin-Device. The callback will be called with the result.

### getACModelInfo(callback)
Get the "Model-Info" details from the Daikin-Device. The callback will be called with the result.

### getACWeekPower(callback)
Get the "Week-Power" details from the Daikin-Device. The callback will be called with the result.

### getACYearPower(callback)
Get the "Year-Power" details from the Daikin-Device. The callback will be called with the result.

### getACWeekPowerExtended(callback)
Get the "Extended Week-Power" details from the Daikin-Device. The callback will be called with the result.

### getACYearPowerExtended(callback)
Get the "Extended Year-Power" details from the Daikin-Device. The callback will be called with the result.

### setACSpecialMode(values, callback)
Send an update for the "Special Mode" data to the device. values is an object with the following possible keys:
* state: Integer, enable or disable the special mode, you can also use DaikinAC-SpecialModeState for allowed values in human readable format
* kind: Integer, the kind of the special mode, you can also use DaikinAC-SpecialModeKind for allowed values in human readable format

Response:
* specialMode: String, the current special mode, you can also use DaikinAC-SpecialModeResponse for allowed values in human readable format

It's possible to set STREAMER mode for a turned off device. POWERFUL/ECONOMY modes will only work when the the device is turned on.

### enableAdapterLED(callback)
Enables the Wifi Controller LEDs.

### disableAdapterLED(callback)
Disables the Wifi Controller LEDs.

### rebootAdapter(callback)
Reboot the Wifi Controller. After this the Basic data are requested agsin and updated locally.

### DaikinACTypes.Power;

### DaikinACTypes.Mode;

### DaikinACTypes.FanRate;

### DaikinACTypes.FanDirection;

### DaikinACTypes.SpecialModeState;

### DaikinACTypes.SpecialModeKind;

### DaikinACTypes.SpecialModeResponse;

### DaikinDiscover.discovery(waitForNrDevices, callback)
This methods sends UDP Broadcasts into the network to discover Daikin devices.

Example:

```
var Daikin = require('../../index.js');

Daikin.discover(2, function(result) {
    console.log(JSON.stringify(result));
});
```
The first Parameter is the number of found devices after which the method stops searching further, else it will do 10 Tries with a 1 second delay. The second parameter is the callback method called with the result.

Result is an Object with the IP as the key and some data as value.

## Todo
* Make discover method better configurable

### Implement missing endpoints (if someone needs them)
The following endpoints  (according to ...) are currently not implemented and can be if needed or if I find time to reverse engineer how they really work.

* /common/set_remote_method
* /common/get_notify and set_notify
* /common/set_regioncode
* /common/get_datetime
* /aircon/get_timer and set_timer
* /aircon/get_price and set_price
* /aircon/get_target and set_target
* /aircon/get_program and set_program
* /aircon/get_scdltimer and set_scdltimer
* /aircon/get_scdltimer_info and set_scdltimer_info
* /aircon/get_scdltimer_body and set_scdltimer_body
* /aircon/get_day_paower_ex

## Changelog

### 1.1.6 (2020-07-20)
* update dependencies
* tests only cover node.js 10.x+ (LTS versions), but library should also work below

### v1.1.5 (25.06.2019)
* also set headers on daikin requests

### v1.1.4 (25.06.2019)
* increase timeouts to 5s

### v1.1.3 (01.02.2019)
* optimize handling of communication errors

### v1.1.2 (29.04.2018)
* fix error handling for communication errors

### v1.1.1 (17.02.2018)
* fix for setACSpecialMode

### v1.1.0 (xx.01.2018)
* add setACSpecialMode (thanks to @b-straub)

### v1.0.0 (2017)
* initial release
