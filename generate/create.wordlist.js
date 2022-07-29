const fileAccess = require("./file.access");
const path = require("path");
const frc = require("../public/js/lib/frc.js");

function createWordlist(corpusPath) {
  console.log("creating wordlist for", corpusPath);

  var tracks = frc.parseTracks(fileAccess.readJSON(corpusPath));
  var words = [];
  tracks.forEach((track) => words.push(...track.tokensLower));/

  var text = words.join("\n");
  var targetPath = path.parse(corpusPath).name + ".words.txt";

  console.log("found", words.length, "words");

  fileAccess.write(text, "./data/" + targetPath);
}

["./data/corpus-non-standard-lower.json", "./data/corpus.json"].forEach(
  createWordlist
);
