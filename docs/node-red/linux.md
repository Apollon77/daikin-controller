**Instruction to integrate the Daikin device into Node-RED**

1. Addition in the settings

After installing Node-RED we add a line in the settings file to make Node-RED include the daikin-controller library. The directory of Node-RED is located in our home directory during standard installation.
```
cd ~/.node-red
nano settings.js
```
with `[Strg] + [W]` we search for the following entry `functionGlobalContext: {` ([!probably line 216](https://github.com/node-red/node-red/blob/master/packages/node_modules/node-red/settings.js#L216)) and add `DaikinAC:require("daikin-controller")`
should look like the following:
```
    ...
    functionGlobalContext: {
        DaikinAC:require("daikin-controller")
        // os:require('os'),
        // jfive:require("johnny-five"),
        // j5board:require("johnny-five").Board({repl:false})
    },
    ...
```
We save the changes and leave the editor.

2. Installing the daikin-controller

The library is installed via npm:
```
cd ~/.node-red
npm install daikin-controller
```
Start (or restart) Node-RED.

3. Add the test flow

In Node-RED we add the content of the file "Testflow-Daikin_node-red.txt" via Import Nodes. A new flow is recommended (but can also be added to an existing one).
The IP address of the Daikin device belongs to the "Global set: DaikinDeviceIP".
![Screenshot_flow](/docs/node-red/screenshot_flow.jpg?raw=true "screenshot of the flow")
