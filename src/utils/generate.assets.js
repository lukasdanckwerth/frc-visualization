/*
 Generates all assets.
 */

const json = require('./file.access');
const frcv = require('../../public/js/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv(corpusJSON);

const relation = corpus.yearDepartementTracksRelation();
console.log(relation);

// const overview = require('./generate.overview.datasets');
