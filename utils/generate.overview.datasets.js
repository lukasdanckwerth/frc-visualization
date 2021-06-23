const json = require('./file.access');
const frcv = require('../public/js/lib/frc');
const corpusJSON = require('./load-corpus').corpusJSON;
const corpus = new frcv(corpusJSON);
let tracks = corpus.allTracks();

// tracks = tracks.splice(0, 100);

function createDataset(valueAccess) {
  let data = [];
  let track, releaseYear, departmentNumber, candidate;

  for (let index = 0; index < tracks.length; index++) {
    track = tracks[index];
    releaseYear = track.releaseYear;
    departmentNumber = track.departmentNumber;
    candidate = data.find(track =>
      track.date === releaseYear && track.location === departmentNumber
    );

    if (candidate) {
      candidate.value += valueAccess(track);
    } else {
      data.push({
        date: track.releaseYear,
        location: track.departmentNumber,
        value: 1,
      });
    }
  }

  return data;
}

let tracksData = createDataset(track => 1);
let tracksDataset = {label: 'Tracks', stack: 'Tracks', data: tracksData};
json.writeAsset(tracksDataset, 'corpus.overview.tracks.json');

let wordsData = createDataset(track => track.components.length);
let wordsDataset = {label: 'Words', stack: 'Words', data: wordsData};
json.writeAsset(wordsDataset, 'corpus.overview.words.json');

let wordsPerDepartement = corpus.getDepartmentsToWords();
let wordsPerYear = corpus.getYearsToWords();
wordsData.forEach(item =>
  item.value
)
