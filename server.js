/**
 * FRC-Visualization
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const application_version = require('./package.json').version;
const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'development';

app.use('/', express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log("start FRC-Visualization " + application_version);
    console.log("listening on port: " + port);
    console.log('environment: ' + environment);
});
