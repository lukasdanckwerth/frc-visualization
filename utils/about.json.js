const fileAccess = require("./file.access");
const package = require("../package.json");
const frc = require("../public/js/lib/frc.js");

let corpusJSONPath = fileAccess.corpusJSONPath;
let json = fileAccess.readCorpusJSON();
let corpus = new frc.Corpus(json);
let artists = corpus.artists;
let tracks = corpus.tracks;
let words = tracks.reduce((p, c) => (p += c.components.length), 0);
let types = tracks.reduce((p, c) => (p += c.types.length), 0);

let about = {
  version: package.version,
  packageName: package.name,
  packageAuthor: package.author,
  environment: package.environment || "production",
  corpusSize: fileAccess.fileSize(corpusJSONPath),
  corpusSizeFormatted: fileAccess.fileSizeFormatted(corpusJSONPath),
  originalCorpusArtists: json.length,
  artists: {
    all: artists.length,
    female: artists.filter((a) => a.sex === "F").length,
    male: artists.filter((a) => a.sex === "M").length,
    groups: artists.filter((a) => a.group === "G").length,
  },
  tracks: tracks.length,
  words: words,
  types: types,
};

fileAccess.writeJSON(about, "about.json");
