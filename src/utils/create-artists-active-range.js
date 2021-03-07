const json = require('./file-access');
const frcv = require('../../public/js/frcv');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv.Corpus(corpusJSON);

let artists = corpus.artists;
let datasets = artists.map(function (artist) {
  let data = artist
    .allTracks()
    .map(function (track) {
      return {
        label: track.title,
        value: 1,
        date: track.releaseYear,
        location: track.departmentNumber
      }
    })

  return {
    label: artist.name,
    data: data
  }
}).filter((dataset) => dataset.data.length > 0);

json.writeAsset(datasets, 'artists-active-range.json')
