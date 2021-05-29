/**
 * FRC-Visualization
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const version = require('./package.json').version;
const port = process.env.PORT || 81;
const environment = process.env.NODE_ENV || 'development';
const fs = require('fs');

let corpusJSONPath = '';

// use a smaller corpus with 100 artists in development mode for faster loading.
if (environment === 'production') {
  corpusJSONPath = __dirname + '/public/assets/corpus.json';
} else {
  corpusJSONPath = __dirname + '/public/assets/corpus.light.json';
}

function bytesToSize(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  let formatted = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  return `${formatted} (${bytes + ' bytes'})`
}

app.use('/', express.static(__dirname + '/public'));
app.use('/corpus', express.static(corpusJSONPath));

const stats = fs.statSync(corpusJSONPath);
const corpusSize = bytesToSize(stats.size);

app.use('/innovation-list', express.static(__dirname + '/public/assets/innovation.list.txt'));

app.use('/version', function (req, res) {
  res.json({version, environment, corpusSize});
});

app.use('/corpus-size', function (req, res) {
  res.json({corpusSize});
});

app.listen(port, function () {
  console.log("start FRC-Visualization " + version);
  console.log("port: " + port);
  console.log('environment: ' + environment);
});
