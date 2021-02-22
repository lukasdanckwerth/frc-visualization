const json = require('./file-access');
const frcv = require('../public/js/frcv');
const {yearCollectionToDataset} = require("./dataset-util");

const sourceFileURL = 'source-data/Corpus.json'
const targetDirectory = './public/assets'

console.log("read corpus");
const corpusJSON = json.read(sourceFileURL);

console.log("parse corpus");
const corpus = new frcv.Corpus(corpusJSON);

let lyricsPerYear = corpus.getLyricsPerYear();
let dataset = yearCollectionToDataset(lyricsPerYear, 'Lyrics per Year');

console.log(dataset);
