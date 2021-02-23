const json = require('./file-access');
const frcv = require('../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);

let tracksLoger = corpus.tracksForWord('loger');
let tracksLargent = corpus.tracksForWord('l\'argent');

let datasetLoger = corpus.createYearAndDepartmentsDatasetForTracks(tracksLoger);
let datasetLargent = corpus.createYearAndDepartmentsDatasetForTracks(tracksLargent);

json.writeAsset(datasetLoger, 'dataset-loger.json')
json.writeAsset(datasetLargent, 'dataset-largent.json')
