const json = require('./file-access');
const frcv = require('../../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);

let tracksMerde = corpus.tracksForWord('merde');
let tracksFuck = corpus.tracksForWord('fuck');

let dataMerde = corpus.createYearAndDepartmentsDataForTracks(tracksMerde);
let dataFuck = corpus.createYearAndDepartmentsDataForTracks(tracksFuck);

let datasetMerde = {
  label: 'merde',
  stack: 'merde',
  data: dataMerde
}

let datasetFuck = {
  label: 'fuck',
  stack: 'fuck',
  data: dataFuck
}

json.writeAsset(datasetMerde, 'dataset-merde.json')
json.writeAsset(datasetFuck, 'grouped-fuck.json')
