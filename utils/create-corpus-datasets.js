const json = require('./file-access');
const frcv = require('../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);
let tracks = corpus.allTracks();
// tracks = tracks.splice(0, 100);

let data = [];

for (let index = 0; index < tracks.length; index++) {
  let track = tracks[index];
  data.push({
    date: track.releaseYear,
    location: track.departmentNumber,
    value: 1
  });
}


let dataset = {
  label: 'Tracks',
  stack: 'Tracks',
  data: data
};

json.writeAsset([dataset], 'corpus-datasets.json');
