const json = require('./file-access');
const frcv = require('../public/js/frcv');

const sourceFileURL = 'source-data/Corpus.json'
const targetDirectory = './public/assets'

console.log("read corpus");
const corpusJSON = json.read(sourceFileURL);

console.log("parse corpus");
const corpus = new frcv.Corpus(corpusJSON);

console.log("clean corpus");
corpus.allTracks().forEach(function (track) {
  track.components = null;
  track.componentsLowercased = null;
  track.types = null;
})

json.write(corpus, targetDirectory + '/Corpus.json');
json.write(corpus.artists.slice(0, 100), targetDirectory + '/Corpus-Light.json');
