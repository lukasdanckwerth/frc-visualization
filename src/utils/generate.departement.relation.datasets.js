const json = require('./file.access');
const frcv = require('../../public/js/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv(corpusJSON);

function createDataset(data, name) {
  return {
    label: name,
    stack: name,
    data: data
  }
}

let tracksPerDepartement = corpus.getDepartmentsToTracks();
let datasetTracks = createDataset(tracksPerDepartement, 'Tracks');
json.writeAsset(datasetTracks, 'departements.to.tracks.json');

let wordsPerDepartement = corpus.getDepartmentsToWords();
let datasetWords = createDataset(wordsPerDepartement, 'Words');
json.writeAsset(datasetWords, 'departements.to.words.json');

let wordsPerDepartementRelative = corpus.getDepartmentsToWordsRelative();
let datasetWordsRelative = createDataset(wordsPerDepartementRelative, 'Words-(Relative)');
json.writeAsset(datasetWordsRelative, 'departements.to.words.relative.json');

let typesDepartment = corpus.getDepartmentsToTypes();
let datasetTypes = createDataset(typesDepartment, 'Types');
json.writeAsset(datasetTypes, 'departements.to.types.json');

let typesDepartmentRelative = corpus.getDepartmentsToTypesRelative();
let datasetTypesRelative = createDataset(typesDepartmentRelative, 'Types-(Relative)');
json.writeAsset(datasetTypesRelative, 'departements.to.types.relative.json');
