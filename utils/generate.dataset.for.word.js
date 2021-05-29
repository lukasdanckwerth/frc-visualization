const json = require('./file.access');
const frcv = require('../../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);
const searchText = "mif,mif',miff,miff',miffs,mifs,mille-f,mi-f,mi-f','mif'";

const datasets = corpus.search(searchText);
json.writeAsset(datasets, 'miff.json');
