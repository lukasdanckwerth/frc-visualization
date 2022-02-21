const fileAccess = require("./file.access");
const package = require("../package.json");
const frc = require("../public/js/lib/frc.js");

let corpusJSONPath = fileAccess.corpusJSONPath;
let json = fileAccess.readCorpusJSON();
let corpus = new frc.Corpus(json);

let about = {
  name: package.name,
  version: package.version,
  authors: ["Lukas Danckwerth", "Jan-Niklas Wilsker"],
  corpus: {
    artists: {
      all: corpus.artists.length,
      female: corpus.artists.filter((a) => a.sex === "F").length,
      male: corpus.artists.filter((a) => a.sex === "M").length,
      groups: corpus.artists.filter((a) => a.group === "G").length,
      index: json.length,
    },
    tracks: corpus.tracks.length,
    tokens: corpus.tracks.reduce((p, c) => (p += c.tokens.length), 0),
    types: corpus.tracks.reduce((p, c) => (p += c.types.length), 0),
    fileSize: {
      bytes: fileAccess.fileSize(corpusJSONPath),
      formatted: fileAccess.fileSizeFormatted(corpusJSONPath),
    },
  },
};

fileAccess.writeJSON(about, "about.json");
