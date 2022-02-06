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

function dataset(name, value) {
  return { label: name, stack: name, data: data(tracks, value) };
}

let tracksDataset = dataset("Tracks", (t) => 1);
fileAccess.writeJSON(tracksDataset, "departements.to.tracks.json");

let wordsDataset = dataset("Words", (t) => t.tokens.length);
fileAccess.writeJSON(wordsDataset, "departements.to.words.json");

let typesDataset = dataset("Types", (t) => t.types.length);
fileAccess.writeJSON(typesDataset, "departements.to.types.json");

wordsDataset.data.forEach(
  (d) => (d.value = d.value / byDepartement.get(d.location))
);
wordsDataset.label = "Words-(Relative)";
wordsDataset.stack = "Words-(Relative)";
fileAccess.writeJSON(wordsDataset, "departements.to.words.relative.json");

typesDataset.data.forEach(
  (d) => (d.value = d.value / byDepartement.get(d.location))
);
typesDataset.label = "Types-(Relative)";
typesDataset.stack = "Types-(Relative)";
fileAccess.writeJSON(typesDataset, "departements.to.types.relative.json");
