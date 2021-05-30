import {Corpus} from "./corpus";

Corpus.prototype.combineData = function (data) {
  let combined = [];
  data.forEach(function (item) {
    let candidate = combined.find(dataset =>
      dataset.location === item.location && dataset.date === item.date);
    if (candidate) {
      candidate.value += item.value;
    } else {
      combined.push({
        date: item.date,
        location: item.location,
        value: item.value
      });
    }
  });
  return combined;
};

Corpus.prototype.artistsToDatasets = function (artists) {
  let datasets = [];
  for (let index = 0; index < artists.length; index++) {
    let artist = artists[index];
    let tracks = artist.allTracks();
    let data = [];
    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
      let track = tracks[trackIndex];
      data.push({
        date: track.releaseYear,
        location: artist.departmentNo,
        value: 1,
      })
    }
    datasets.push({
      label: artist.name,
      stack: artist.name,
      data: data
    })
  }
  return datasets;
}
