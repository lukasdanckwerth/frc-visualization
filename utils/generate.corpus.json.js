const fileAccess = require("./file.access");
const corpus = fileAccess.readCorpus();

corpus.allTracks().forEach(function (track) {
  track.components = null;
  track.componentsLowercased = null;
  track.types = null;
});

fileAccess.writeAsset(corpus.artists, "corpus.json");
fileAccess.writeAsset(corpus.artists.slice(0, 100), "corpus.light.json");
