const fileAccess = require("./file.access");
const corpus = fileAccess.corpus;

function createDataset(data, name) {
  return {
    label: name,
    stack: name,
    data: data,
  };
}

let tracksPerYear = corpus.getYearsToTrackNumbers();
let datasetLyrics = createDataset(tracksPerYear, "Tracks");
fileAccess.writeAsset(datasetLyrics, "year.to.track.json", false);

let wordsPerYear = corpus.getYearsToWords();
let datasetWords = createDataset(wordsPerYear, "Words");
fileAccess.writeAsset(datasetWords, "year.to.words.json", false);

let wordsPerYearRelative = corpus.getYearsToWordsRelative();
let datasetWordsRelative = createDataset(
  wordsPerYearRelative,
  "Words-(Relative)"
);
fileAccess.writeAsset(
  datasetWordsRelative,
  "year.to.words.relative.json",
  false
);

let typesPerYear = corpus.getYearsToTypes();
let datasetTypes = createDataset(typesPerYear, "Types");
fileAccess.writeAsset(datasetTypes, "year.to.types.json", false);

let typesPerYearRelative = corpus.getYearsToTypesRelative();
let datasetTypesRelative = createDataset(
  typesPerYearRelative,
  "Types-(Relative)"
);
fileAccess.writeAsset(
  datasetTypesRelative,
  "year.to.types.relative.json",
  false
);
