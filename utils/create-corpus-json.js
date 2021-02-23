const json = require('./file-access');
const frcv = require('../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);

corpus.allTracks().forEach(function (track) {
  track.components = null;
  track.componentsLowercased = null;
  track.types = null;
})

json.writeAsset(corpus, '/Corpus.json');
json.writeAsset(corpus.artists.slice(0, 100), '/Corpus-Light.json');
