const json = require('./file-access');
const frcv = require('../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);

let tracksMerde = corpus.tracksForWord('merde');
let tracksFuck = corpus.tracksForWord('fuck');

console.log(tracksMerde.length);
console.log(tracksFuck.length);

