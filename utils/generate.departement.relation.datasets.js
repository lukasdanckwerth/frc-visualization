const fileAccess = require("./file.access");
const corpus = fileAccess.corpus;

function createDataset(data, name) {
  return {
    label: name,
    stack: name,
    data: data,
  };
}

let tracksPerDepartement = corpus.getDepartmentsToTracks();
let datasetTracks = createDataset(tracksPerDepartement, "Tracks");
fileAccess.writeAsset(datasetTracks, "departements.to.tracks.json", false);

let wordsPerDepartement = corpus.getDepartmentsToWords();
let datasetWords = createDataset(wordsPerDepartement, "Words");
fileAccess.writeAsset(datasetWords, "departements.to.words.json");

let datasetWordsRelative = createDataset(
  corpus.getDepartmentsToWordsRelative(),
  "Words-Relative"
);
fileAccess.writeAsset(
  datasetWordsRelative,
  "departements.to.words.relative.json"
);

let typesDepartment = corpus.getDepartmentsToTypes();
let datasetTypes = createDataset(typesDepartment, "Types");
fileAccess.writeAsset(datasetTypes, "departements.to.types.json");

let datasetTypesRelative = createDataset(
  corpus.getDepartmentsToTypesRelative(),
  "Types-Relative"
);
fileAccess.writeAsset(
  datasetTypesRelative,
  "departements.to.types.relative.json"
);

let datasetArtists = createDataset(corpus.getDepartmentsToArtists(), "Artists");
fileAccess.writeAsset(datasetArtists, "departements.to.artists.json", false);

let datasetMaleArtists = createDataset(
  corpus.getDepartmentsToMaleArtists(),
  "Male Artists"
);
fileAccess.writeAsset(
  datasetMaleArtists,
  "departements.to.male.artists.json",
  false
);

let datasetFemaleArtists = createDataset(
  corpus.getDepartmentsToFemaleArtists(),
  "Female Artists"
);
fileAccess.writeAsset(
  datasetFemaleArtists,
  "departements.to.female.artists.json",
  false
);

let datasetGroupArtists = createDataset(
  corpus.getDepartmentsToGroupArtists(),
  "Group Artists"
);
fileAccess.writeAsset(
  datasetGroupArtists,
  "departements.to.group.artists.json",
  false
);
