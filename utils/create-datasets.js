const json = require('./file-access');
const frcv = require('../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);
const {yearCollectionToDataset} = require("./dataset-util");

let lyricsPerYear = corpus.getLyricsPerYear();
let datasetLyrics = yearCollectionToDataset(lyricsPerYear, 'Tracks');
json.writeAsset(datasetLyrics, '/lyrics-per-year.json');

let wordsPerYear = corpus.getWordsPerYear();
let datasetWords = yearCollectionToDataset(wordsPerYear, 'Words');
json.writeAsset(datasetWords, '/words-per-year.json');

let wordsPerYearRelative = corpus.getWordsPerYearRelative();
let datasetWordsRelative = yearCollectionToDataset(wordsPerYearRelative, 'Words (Relative)');
json.writeAsset(datasetWordsRelative, '/words-per-year-relative.json');

let typesPerYear = corpus.getTypesPerYear();
let datasetTypes = yearCollectionToDataset(typesPerYear, 'Types');
json.writeAsset(datasetTypes, '/types-per-year.json');

let typesPerYearRelative = corpus.getTypesPerYearRelative();
let datasetTypesRelative = yearCollectionToDataset(typesPerYearRelative, 'Types (Relative)');
json.writeAsset(datasetTypesRelative, '/types-per-year-relative.json');
