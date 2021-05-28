const json = require('./file-access');
const frc = require('../../public/js/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frc(corpusJSON);

let artists = corpus.artists;
let maleArtists = corpus.maleArtists();
let femaleArtists = corpus.femaleArtists();
let groupArtists = corpus.groupArtists();

function createDatasets(artists, name) {
  return artists.map(function (artist) {
    let data = artist
      .allTracks()
      .map(function (track) {
        return {
          // label: track.title,
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
}

json.writeAsset(createDatasets(artists), 'artists.active.range.json');
json.writeAsset(createDatasets(maleArtists), 'artists.active.range.male.json');
json.writeAsset(createDatasets(femaleArtists), 'artists.active.range.female.json');
json.writeAsset(createDatasets(groupArtists), 'artists.active.range.groups.json');
