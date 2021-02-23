const json = require('./file-access');
const frcv = require('../public/js/frcv');
const {yearCollectionToDataset} = require("./dataset-util");

const sourceFileURL = 'data/Corpus.json'
const targetDirectory = './public/assets'

console.log("read corpus");
const corpusJSON = json.read(sourceFileURL);

console.log("parse corpus");
const corpus = new frcv.Corpus(corpusJSON);

let lyricsPerYear = corpus.getLyricsPerYear();
let datasetLyrics = yearCollectionToDataset(lyricsPerYear, 'Tracks');
json.write(datasetLyrics, targetDirectory + '/lyrics-per-year.json');

let wordsPerYear = corpus.getWordsPerYear();
let datasetWords = yearCollectionToDataset(wordsPerYear, 'Words');
json.write(datasetWords, targetDirectory + '/words-per-year.json');

let wordsPerYearRelative = corpus.getWordsPerYearRelative();
let datasetWordsRelative = yearCollectionToDataset(wordsPerYearRelative, 'Words (Relative)');
json.write(datasetWordsRelative, targetDirectory + '/words-per-year-relative.json');

let typesPerYear = corpus.getTypesPerYear();
let datasetTypes = yearCollectionToDataset(typesPerYear, 'Types');
json.write(datasetTypes, targetDirectory + '/types-per-year.json');

let typesPerYearRelative = corpus.getTypesPerYearRelative();
let datasetTypesRelative = yearCollectionToDataset(typesPerYearRelative, 'Types (Relative)');
json.write(datasetTypesRelative, targetDirectory + '/types-per-year-relative.json');
