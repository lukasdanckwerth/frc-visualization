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
    if (t.releaseYear < 2000) continue;

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

let tokensF = dataset("Tokens Female", (t) =>
  t.sex === "F" ? t.tokens.length : 0
);
let tokensM = dataset("Tokens Male", (t) =>
  t.sex === "M" ? t.tokens.length : 0
);
let tokensG = dataset("Tokens Group", (t) =>
  t.sex === "G" ? t.tokens.length : 0
);

tokensF.stack = "Tokens";
tokensM.stack = "Tokens";
tokensG.stack = "Tokens";

let typesF = dataset("Types Female", (t) =>
  t.sex === "F" ? t.types.length : 0
);
let typesM = dataset("Types Male", (t) => (t.sex === "M" ? t.types.length : 0));
let typesG = dataset("Types Group", (t) =>
  t.sex === "G" ? t.types.length : 0
);

typesF.stack = "Types";
typesM.stack = "Types";
typesG.stack = "Types";

let tokensDataset = dataset("Tokens", (t) => t.tokens.length);
let typesDataset = dataset("Types", (t) => t.types.length);
tokensF.about =
  "Amount of the tokens and the types of the corpus stacked by female, male and group artists.";

fileAccess.writeJSON(
  [tokensF, tokensM, tokensG, typesF, typesM, typesG],
  "year.to.tokens.and.types.json"
);

tokensDataset.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
tokensDataset.label = "Tokens (per Track)";
typesDataset.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
typesDataset.label = "Types (per Track)";

tokensDataset.about =
  "Tokens and types for each year devided by the total amount of tracks per year.";

fileAccess.writeJSON(
  [tokensDataset, typesDataset],
  "year.to.tokens.and.types.relative.json"
);

typesDataset = dataset("Types", (t) => t.types.length);
typesDataset.data.forEach((d) => (d.value = d.value / tokensADate.get(d.date)));
typesDataset.label = "Types (per Tokens)";
typesDataset.about =
  "The percentage of types in lyrics. The higher the number the more diversity of tokens is used.";

fileAccess.writeJSON([typesDataset], "year.to.types.per.tokens.json");

let datasetFemale = dataset("Female", (t) => (t.sex === "F" ? 1 : 0));
let datasetMale = dataset("Male", (t) => (t.sex === "M" ? 1 : 0));
let datasetGroup = dataset("Group", (t) => (t.sex === "G" ? 1 : 0));
let datasets = [datasetFemale, datasetMale, datasetGroup];
datasetFemale.about =
  "Amount of Tracks grouped by female, male and group artists.";

fileAccess.writeJSON(datasets, "year.to.tracks.grouped.json");

datasetFemale.stack = "All";
datasetMale.stack = "All";
datasetGroup.stack = "All";

datasetFemale.about =
  "Amount of Tracks stacked by female, male and group artists.";

fileAccess.writeJSON(
  [datasetFemale, datasetMale, datasetGroup],
  "year.to.tracks.stacked.json"
);

delete datasetFemale.stack;
delete datasetMale.stack;
delete datasetGroup.stack;

datasetFemale.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
datasetFemale.label = "Female";
datasetMale.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
datasetMale.label = "Male";
datasetGroup.data.forEach((d) => (d.value = d.value / byYear.get(d.date)));
datasetGroup.label = "Groups";

datasetFemale.about =
  "Grouped percentage of Tracks made by female, male and group artists.";

fileAccess.writeJSON(
  [datasetFemale, datasetMale, datasetGroup],
  "year.to.artists.per.tracks.json"
);

datasetFemale.stack = "Artists per Tracks";
datasetMale.stack = "Artists per Tracks";
datasetGroup.stack = "Artists per Tracks";

datasetFemale.about =
  "Stacked percentage of Tracks made by female, male and group artists.";

fileAccess.writeJSON(
  [datasetFemale, datasetMale, datasetGroup],
  "year.to.artists.per.tracks.stacked.json"
);
