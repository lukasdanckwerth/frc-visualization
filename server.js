'use strict';
/**
 * FRC-Visualization
 *
 * Author:
 *  - Lukas Danckwerth
 */
const paths = {
  corpus: 'data/Corpus.json',
  corpusLight: 'data/Corpus-Light.json',
  corpusOriginal: 'data/Corpus-Original.json',
  departements: 'data/Departements.json'
};

// use express app for handling incoming requests
const express = require("express");
const fs = require('fs');

const app = express();
const application_version = require('./submodule/lotivis/package.json').version;
const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'development';
const bodyParser = require("body-parser");

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log("start FRC-Visualization " + application_version);
    console.log("listening on port: " + port);
    console.log('environment: ' + environment);
});
