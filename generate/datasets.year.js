const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");
const d3 = require("d3");

const json = fileAccess.readCorpusJSON();
const tracks = frc.parseTracks(json);

const byYear = d3.rollup(
  tracks,
  (v) => v.length,
  (d) => d.releaseYear
);

const tokensADate = d3.rollup(
  tracks,
  (v) => d3.sum(v, (d) => d.tokens.length),
  (d) => d.releaseYear
);

console.log("tokensADate", tokensADate);

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

let tokensDataset = dataset("Tokens", (t) => t.tokens.length);
fileAccess.writeJSON([tokensDataset], "year.to.tokens.json");

let typesDataset = dataset("Types", (t) => t.types.length);
fileAccess.writeJSON([typesDataset], "year.to.types.json");

fileAccess.writeJSON(
  [tokensDataset, typesDataset],
  "year.to.tokens.types.json"
);

tokensDataset.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
tokensDataset.label = "Tokens-(Relative)";
fileAccess.writeJSON([tokensDataset], "year.to.tokens.per.tracks.json");

typesDataset.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
typesDataset.label = "Types-(Relative)";
fileAccess.writeJSON([typesDataset], "year.to.types.per.tracks.json");

typesDataset = dataset("Types", (t) => t.types.length);
typesDataset.data.forEach((d) => (d.value = d.value / tokensADate.get(d.date)));
typesDataset.label = "Types-(Relative)";
fileAccess.writeJSON([typesDataset], "year.to.types.per.tokens.json");

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

datasetFemale.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
datasetFemale.label = "Female Relative per Year";
datasetMale.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
datasetMale.label = "Male Relative per Year";
datasetGroup.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
datasetGroup.label = "Groups Relative per Year";
fileAccess.writeJSON(
  [datasetFemale, datasetMale, datasetGroup],
  "year.to.artists.per.tracks.json"
);
