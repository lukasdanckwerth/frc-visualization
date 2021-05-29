const json = require('./file.access');
const frcv = require('../public/js/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv(corpusJSON);

function createDataset(data, name) {
  return {
    label: name,
    stack: name,
    data: data
  }
}

let tracksPerYear = corpus.getYearsToTrackNumbers();
let datasetLyrics = createDataset(tracksPerYear, 'Tracks');
json.writeAsset(datasetLyrics, 'year.to.track.json', false);

let wordsPerYear = corpus.getYearsToWords();
let datasetWords = createDataset(wordsPerYear, 'Words');
json.writeAsset(datasetWords, 'year.to.words.json', false);

let wordsPerYearRelative = corpus.getYearsToWordsRelative();
let datasetWordsRelative = createDataset(wordsPerYearRelative, 'Words-(Relative)');
json.writeAsset(datasetWordsRelative, 'year.to.words.relative.json', false);

let typesPerYear = corpus.getYearsToTypes();
let datasetTypes = createDataset(typesPerYear, 'Types');
json.writeAsset(datasetTypes, 'year.to.types.json', false);

let typesPerYearRelative = corpus.getYearsToTypesRelative();
let datasetTypesRelative = createDataset(typesPerYearRelative, 'Types-(Relative)');
json.writeAsset(datasetTypesRelative, 'year.to.types.relative.json', false);
