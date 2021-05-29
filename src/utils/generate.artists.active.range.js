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

json.writeAsset(createDatasets(artists, 'All'), 'artists.active.range.json');
json.writeAsset(createDatasets(maleArtists, 'Male'), 'artists.active.range.male.json');
json.writeAsset(createDatasets(femaleArtists, 'Female'), 'artists.active.range.female.json');
json.writeAsset(createDatasets(groupArtists, 'Groups'), 'artists.active.range.groups.json');
