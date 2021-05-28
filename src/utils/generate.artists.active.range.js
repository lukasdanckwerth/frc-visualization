const json = require('./file.access');
const frc = require('../../public/js/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frc(corpusJSON);

let artists = corpus.artists;
let maleArtists = corpus.maleArtists();
let femaleArtists = corpus.femaleArtists();
let groupArtists = corpus.groupArtists();

function createDatasets(artists, label) {
  let dataset = artists.map(function (artist) {
    let data = artist
      .allTracks()
      .map(function (track) {
        return {
          // label: track.title,
          value: 1,
          date: track.releaseYear,
          location: track.departmentNumber
        };
      });

    return {
      label: artist.name,
      data: data
    };

  }).filter((dataset) => dataset.data.length > 0);
  dataset.label = label;
  return dataset;
}

json.writeAsset(createDatasets(artists), 'All');
json.writeAsset(createDatasets(maleArtists), 'Male');
json.writeAsset(createDatasets(femaleArtists), 'Female');
json.writeAsset(createDatasets(groupArtists), 'Groups');
