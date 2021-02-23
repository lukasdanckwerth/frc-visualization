const json = require('./file-access');
const frcv = require('../public/js/frcv');
const {yearCollectionToDataset} = require("./dataset-util");

const sourceFileURL = 'data/Corpus.json'
const targetDirectory = './public/assets'

console.log("read corpus");
const corpusJSON = json.read(sourceFileURL);

console.log("parse corpus");
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
json.write(datasetTracks, targetDirectory + '/tracks-per-departement.json');

let wordsPerDepartement = corpus.getWordsPerDepartment();
let datasetWords = createDataset(wordsPerDepartement, 'Words');
json.write(datasetWords, targetDirectory + '/words-per-departement.json');

let wordsPerDepartementRelative = corpus.getWordsPerDepartmentRelative();
let datasetWordsRelative = createDataset(wordsPerDepartementRelative, 'Words (Relative)');
json.write(datasetWordsRelative, targetDirectory + '/words-per-departement-relative.json');

let typesDepartment = corpus.getTypesPerDepartment();
let datasetTypes = createDataset(typesDepartment, 'Types');
json.write(datasetTypes, targetDirectory + '/types-per-departement.json');

let typesDepartmentRelative = corpus.getTypesPerDepartmentRelative();
let datasetTypesRelative = createDataset(typesDepartmentRelative, 'Types (Relative)');
json.write(datasetTypesRelative, targetDirectory + '/types-per-departement-relative.json');
