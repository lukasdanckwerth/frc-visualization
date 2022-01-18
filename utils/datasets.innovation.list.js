const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");
const lotivis = require("../public/js/lib/lotivis.js");

let innovationList = (fileAccess.read("data/innovation.list.txt") + "")
  .replaceAll("\n", ",")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
console.log("innovationList", innovationList.length);

const json = fileAccess.readCorpusJSON();
const corpus = new frc.Corpus(json);

function search(name, countType) {
  console.log("search", name, countType);

  const datasets = corpus.search(
    innovationList.join(","),
    1995,
    2021,
    "case-insensitive",
    countType
  );

  datasets.forEach((d) => {
    d.label = "InnovationList";
    d.stack = "InnovationList";
    d.data.forEach((d) => delete d.track);
    delete d.tracks;
  });

  console.log(name, "datasets", datasets.length);
  // fileAccess.writeJSON(datasets, name + ".json");

  let flat = lotivis.flatDatasets(datasets);
  console.log(name, "flat", flat.length);
  // fileAccess.writeJSON(flat, name + ".flat.json");

  let combined = lotivis.toDataset(flat);
  console.log("datasets combined", combined.length);
  fileAccess.writeJSON(combined[0], "corpus.overview." + name + ".json");
}

search("innovation.list", frc.SEARCH_COUNT.tracks);
search("innovation.list.relative.date", frc.SEARCH_COUNT.tracksRelativeDate);
search(
  "innovation.list.relative.location",
  frc.SEARCH_COUNT.tracksRelativeLocation
);

search("innovation.list.words", frc.SEARCH_COUNT.words);
search(
  "innovation.list.words.relative.date",
  frc.SEARCH_COUNT.wordsRelativeDate
);
search(
  "innovation.list.words.relative.location",
  frc.SEARCH_COUNT.wordsRelativeLocation
);
