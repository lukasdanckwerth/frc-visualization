const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");
const d3 = require("d3");

const json = fileAccess.readCorpusJSON();
const tracks = frc.parseTracks(json);

const byDepartement = d3.rollup(
  tracks,
  (v) => v.length,
  (d) => d.departementNo
);

function data(tracks, value) {
  let data = [];
  for (let t, candidate, i = 0; i < tracks.length; i++) {
    t = tracks[i];
    if (!t) throw new Error("track invalid: " + i);
    if (!t.departementNo) throw new Error("no departement no: " + i);
    candidate = data.find((d) => d.location === t.departementNo);
    if (candidate) {
      candidate.value += value(t);
    } else {
      data.push({
        location: "" + t.departementNo,
        value: value(t),
      });
    }
  }
  return data;
}

function dataset(name, value, stack) {
  return { label: name, stack: stack || name, data: data(tracks, value) };
}

let tracksData = dataset("Tracks", (t) => 1);
let tracksDataset = [tracksData];
tracksData.about =
  "Displays from the corpus the numbers of tracks for each department.";
console.log("tracksDataset", tracksDataset);
fileAccess.writeJSON(tracksDataset, "department.to.tracks.json");

let tokensData = dataset("Tokens", (t) => t.tokens.length);
let typesData = dataset("Types", (t) => t.types.length);

let tokensDataRelative = dataset("Tokens (Relative)", (t) => t.tokens.length);
let typesDataRelative = dataset("Types (Relative)", (t) => t.types.length);

tokensDataRelative.data.forEach(
  (d) => (d.value = d.value / byDepartement.get(d.location))
);

typesDataRelative.data.forEach(
  (d) => (d.value = d.value / byDepartement.get(d.location))
);

let datasets = [tokensData, tokensDataRelative, typesData, typesDataRelative];

fileAccess.writeJSON(datasets, "department.to.tokens.and.types.json");
