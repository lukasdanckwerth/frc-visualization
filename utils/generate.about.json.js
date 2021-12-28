const fileAccess = require("./file.access");
const corpus = fileAccess.readCorpus();
const package = require("../package.json");

let artistsCount = corpus.artists.length;
let artistsWithoutTracksCount = corpus.artistsWithoutTracks.length;
let tracksCount = corpus.allTracks().length;

let about = {
  version: package.version,
  packageName: package.name,
  packageAuthor: package.author,
  environment: package.environment || "production",
  corpusSize: fileAccess.fileSize("public/assets/corpus.json"),
  artists: artistsCount,
  artistsWithoutTracks: artistsWithoutTracksCount,
  tracks: tracksCount,
  wordsCount: corpus.wordsCount,
};

fileAccess.writeAsset(about, "about.json", false);
