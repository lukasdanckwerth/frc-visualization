const json = require('./file.access');
const frcv = require('../public/js/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv(corpusJSON);
const {yearCollectionToDataset} = require("./dataset.util");

let tracksPerYear = corpus.getYearsToTrackNumbers();
let datasetLyrics = yearCollectionToDataset(tracksPerYear, 'Tracks');
json.writeAsset(datasetLyrics, 'year.to.track.json');

let wordsPerYear = corpus.getYearsToWords();
let datasetWords = yearCollectionToDataset(wordsPerYear, 'Words');
json.writeAsset(datasetWords, 'year.to.words.json');

let wordsPerYearRelative = corpus.getYearsToWordsRelative();
let datasetWordsRelative = yearCollectionToDataset(wordsPerYearRelative, 'Words-(Relative)');
json.writeAsset(datasetWordsRelative, 'year.to.words.relative.json');

let typesPerYear = corpus.getYearsToTypes();
let datasetTypes = yearCollectionToDataset(typesPerYear, 'Types');
json.writeAsset(datasetTypes, 'year.to.types.json');

let typesPerYearRelative = corpus.getYearsToTypesRelative();
let datasetTypesRelative = yearCollectionToDataset(typesPerYearRelative, 'Types-(Relative)');
json.writeAsset(datasetTypesRelative, 'year.to.types.relative.json');
