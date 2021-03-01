/**
 * FRC-Visualization
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const version = require('./package.json').version;
const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'development';

app.use('/', express.static(__dirname + '/public'));

if (environment === 'development') {
  app.use('/corpus', express.static(__dirname + '/public/assets/Corpus-Light.json'));
} else {
  app.use('/corpus', express.static(__dirname + '/public/assets/Corpus.json'));
}

app.use('/innovation-list', express.static(__dirname + '/public/assets/InnovationList.txt'));

app.use('/version', function (req, res) {
  res.json({version, environment});
});

app.listen(port, function () {
  console.log("start FRC-Visualization " + version);
  console.log("port: " + port);
  console.log('environment: ' + environment);
});
