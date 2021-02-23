const json = require('./file-access');
const frcv = require('../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);

function createDataset(data, name) {
  return {
    label: name,
    stack: name,
    data: data
  }
}

let tracksPerDepartement = corpus.getTracksPerDepartment();
let datasetTracks = createDataset(tracksPerDepartement, 'Tracks');
json.writeAsset(datasetTracks, '/tracks-per-departement.json');

let wordsPerDepartement = corpus.getWordsPerDepartment();
let datasetWords = createDataset(wordsPerDepartement, 'Words');
json.writeAsset(datasetWords, '/words-per-departement.json');

let wordsPerDepartementRelative = corpus.getWordsPerDepartmentRelative();
let datasetWordsRelative = createDataset(wordsPerDepartementRelative, 'Words (Relative)');
json.writeAsset(datasetWordsRelative, '/words-per-departement-relative.json');

let typesDepartment = corpus.getTypesPerDepartment();
let datasetTypes = createDataset(typesDepartment, 'Types');
json.writeAsset(datasetTypes, '/types-per-departement.json');

let typesDepartmentRelative = corpus.getTypesPerDepartmentRelative();
let datasetTypesRelative = createDataset(typesDepartmentRelative, 'Types (Relative)');
json.writeAsset(datasetTypesRelative, '/types-per-departement-relative.json');
