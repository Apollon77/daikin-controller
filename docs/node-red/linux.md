**Instruction to integrate the Daikin device into Node-RED**

1. Addition in the settings

After installing Node-RED we add a line in the settings file to make Node-RED include the daikin-controller library. The directory of Node-RED is located in our home directory during standard installation.
```
cd ~/.node-red
nano settings.js
```
we search `[Strg] + [W]` for the following entry `functionGlobalContext: {` and add `DaikinAC:require("daikin-controller")`
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
We save the changes `[Strg] + [O]` and leave the editor `[Strg] + [X]`.

2. Installing the daikin-controller

The library is installed via npm:
```
cd ~/.node-red
npm install daikin-controller
```
Start (or restart) Node-RED.

3. Add the test flow

In Node-RED we add the content of the file [Testflow-Daikin_node-red.json](Testflow-Daikin_node-red.json) via Import Nodes. A new flow is recommended, but can also be added to an existing one.
The IP address of the Daikin device belongs to the "Global set: DaikinDeviceIP".
![Screenshot_flow](/docs/node-red/screenshot_flow.jpg?raw=true "screenshot of the flow")
