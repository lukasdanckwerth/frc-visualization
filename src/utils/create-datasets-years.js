const json = require('./file-access');
const frcv = require('../../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);
const {yearCollectionToDataset} = require("./dataset-util");

let tracksPerYear = corpus.getYearsToTrackNumbers();
let datasetLyrics = yearCollectionToDataset(tracksPerYear, 'Tracks');
json.writeAsset(datasetLyrics, 'tracks-per-year.json');

let wordsPerYear = corpus.getYearsToWords();
let datasetWords = yearCollectionToDataset(wordsPerYear, 'Words');
json.writeAsset(datasetWords, 'words-per-year.json');

let wordsPerYearRelative = corpus.getYearsToWordsRelative();
let datasetWordsRelative = yearCollectionToDataset(wordsPerYearRelative, 'Words (Relative)');
json.writeAsset(datasetWordsRelative, 'words-per-year-relative.json');

let typesPerYear = corpus.getYearsToTypes();
let datasetTypes = yearCollectionToDataset(typesPerYear, 'Types');
json.writeAsset(datasetTypes, 'types-per-year.json');

let typesPerYearRelative = corpus.getYearsToTypesRelative();
let datasetTypesRelative = yearCollectionToDataset(typesPerYearRelative, 'Types (Relative)');
json.writeAsset(datasetTypesRelative, 'types-per-year-relative.json');
