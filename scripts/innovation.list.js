const fileAccess = require("./file.access");
const frc = require("../dist/frc.js");
const lotivis = require("lotivis");

let innovationList = (fileAccess.read("data/innovation.list.txt") + "")
  .replaceAll("\n", ",")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
console.log("innovationList", innovationList.length);

const json = fileAccess.readCorpusJSON();
const corpus = new frc.Corpus(json);

function search(countType) {
  console.log("search", countType);

  const datasets = corpus.search(
    innovationList.join(","),
    1995,
    2021,
    "case-insensitive",
    countType
  );

  datasets.forEach((d) => {
    d.label = "InnovationList";
    d.group = "InnovationList";
    d.data.forEach((d) => delete d.track);
    delete d.tracks;
  });

  let flat = lotivis.flatDatasets(datasets);
  let combined = lotivis.toDataset(flat);

  console.log("datasets combined", combined.length);

  return combined[0];
}

let overview = search(frc.SearchCountType.tracks);
fileAccess.writeJSON(overview, "overview.innovation.list.json");

let overviewTokens = search(frc.SearchCountType.words);
fileAccess.writeJSON(overviewTokens, "overview.innovation.list.tokens.json");

let yearToInnovation = search(frc.SearchCountType.tracksRelativeDate);
yearToInnovation.about =
  "Neologismus candidates in lyrics per tracks. The higher the number the more neologismus candidates are used.";
fileAccess.writeJSON(
  [yearToInnovation],
  "year.to.innovation.list.relative.json"
);

let yearToInnovationTokens = search(frc.SearchCountType.wordsRelativeDate);
yearToInnovationTokens.about =
  "Neologismus candidates percentage of tokens in lyrics. How much of the tokens are neologismus candidates.";
fileAccess.writeJSON(
  [yearToInnovationTokens],
  "year.to.innovation.list.tokens.relative.json"
);

let depToInnovation = search(frc.SearchCountType.tracksRelativeLocation);
fileAccess.writeJSON(
  [depToInnovation],
  "department.to.innovation.list.relative.json"
);

let depInnovationTokens = search(frc.SearchCountType.wordsRelativeLocation);
fileAccess.writeJSON(
  [depInnovationTokens],
  "department.to.innovation.list.tokens.relative.json"
);
