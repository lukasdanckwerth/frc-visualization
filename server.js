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
let corpusSize = 0;

fs.stat(__dirname + '/public/assets/corpus.json', (err, stats) => {
  if (err) {
    console.log(`File doesn't exist.`);
  } else {
    corpusSize = stats.size;
  }
});

app.use('/', express.static(__dirname + '/public'));

// use a smaller corpus with 100 artists in development mode for faster loading.
if (environment === 'production') {
  app.use('/corpus', express.static(__dirname + '/public/assets/corpus.json'));
} else {
  app.use('/corpus', express.static(__dirname + '/public/assets/corpus.light.json'));
}

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
