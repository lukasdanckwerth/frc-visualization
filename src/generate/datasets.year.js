const fileAccess = require("./file.access");
const frc = require("../../public/js/lib/frc.js");
const d3 = require("d3");

const json = fileAccess.readCorpusJSON();
const tracks = frc.parseTracks(json);

const byYear = d3.rollup(
  tracks,
  (v) => v.length,
  (d) => d.releaseYear
);

function data(tracks, value) {
  let data = [];
  for (let t, candidate, i = 0; i < tracks.length; i++) {
    t = tracks[i];
    if (!t) throw new Error("track invalid: " + i);
    if (!t.releaseYear) throw new Error("no release year: " + i);
    candidate = data.find((d) => d.date === t.releaseYear);
    if (candidate) {
      candidate.value += value(t);
    } else {
      data.push({
        date: t.releaseYear,
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
fileAccess.writeJSON([tracksDataset], "year.to.track.json");

let wordsDataset = dataset("Words", (t) => t.components.length);
fileAccess.writeJSON([wordsDataset], "year.to.words.json");

let typesDataset = dataset("Types", (t) => t.types.length);
fileAccess.writeJSON([typesDataset], "year.to.types.json");

wordsDataset.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
wordsDataset.label = "Words-(Relative)";
fileAccess.writeJSON([wordsDataset], "year.to.words.relative.json");

typesDataset.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
typesDataset.label = "Types-(Relative)";
fileAccess.writeJSON([typesDataset], "year.to.types.relative.json");

let datasetFemale = dataset("Female", (t) => (t.sex === "F" ? 1 : 0));
fileAccess.writeJSON([datasetFemale], "year.to.female.json");

let datasetMale = dataset("Male", (t) => (t.sex === "M" ? 1 : 0));
fileAccess.writeJSON([datasetMale], "year.to.male.json");

let datasetGroup = dataset("Group", (t) => (t.sex === "G" ? 1 : 0));
fileAccess.writeJSON([datasetGroup], "year.to.group.json");

fileAccess.writeJSON(
  [datasetFemale, datasetMale, datasetGroup],
  "year.to.artists.json"
);
