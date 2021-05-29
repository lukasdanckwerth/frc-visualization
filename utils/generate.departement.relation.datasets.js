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

let tracksPerDepartement = corpus.getDepartmentsToTracks();
let datasetTracks = createDataset(tracksPerDepartement, 'Tracks');
json.writeAsset(datasetTracks, 'departements.to.tracks.json', false);

let wordsPerDepartement = corpus.getDepartmentsToWords();
let datasetWords = createDataset(wordsPerDepartement, 'Words');
json.writeAsset(datasetWords, 'departements.to.words.json');

let typesDepartment = corpus.getDepartmentsToTypes();
let datasetTypes = createDataset(typesDepartment, 'Types');
json.writeAsset(datasetTypes, 'departements.to.types.json');

let datasetArtists = createDataset(corpus.getDepartmentsToArtists(), 'Artists');
json.writeAsset(datasetArtists, 'departements.to.artists.json', false);

let datasetMaleArtists = createDataset(corpus.getDepartmentsToMaleArtists(), 'Male Artists');
json.writeAsset(datasetMaleArtists, 'departements.to.male.artists.json', false);

let datasetFemaleArtists = createDataset(corpus.getDepartmentsToFemaleArtists(), 'Female Artists');
json.writeAsset(datasetFemaleArtists, 'departements.to.female.artists.json', false);

let datasetGroupArtists = createDataset(corpus.getDepartmentsToGroupArtists(), 'Group Artists');
json.writeAsset(datasetGroupArtists, 'departements.to.group.artists.json', false);
