const fileAccess = require("./file.access");
const corpus = fileAccess.corpus;

let artists = corpus.artists;
let maleArtists = corpus.maleArtists();
let femaleArtists = corpus.femaleArtists();
let groupArtists = corpus.groupArtists();

function createDatasets(artists, label) {
  let dataset = artists
    .map(function (artist) {
      let data = artist.allTracks().map(function (track) {
        return {
          // label: track.title,
          value: 1,
          date: track.releaseYear,
          location: track.departmentNumber,
        };
      });

      return {
        label: artist.name,
        data: corpus.combineData(data),
      };
    })
    .filter((dataset) => dataset.data.length > 0);
  dataset.label = label;
  return dataset;
}

fileAccess.writeAsset(
  createDatasets(artists, "All"),
  "artists.active.range.json"
);
fileAccess.writeAsset(
  createDatasets(maleArtists, "Male"),
  "artists.active.range.male.json"
);
fileAccess.writeAsset(
  createDatasets(femaleArtists, "Female"),
  "artists.active.range.female.json"
);
fileAccess.writeAsset(
  createDatasets(groupArtists, "Groups"),
  "artists.active.range.groups.json"
);
