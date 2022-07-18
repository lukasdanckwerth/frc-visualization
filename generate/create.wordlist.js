const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");
const json = fileAccess.readJSON("./data/corpus-non-standard-lower.json");
const tracks = frc.parseTracks(json);

var words = [];

tracks.forEach((track) => words.push(...track.tokensLower));

console.log("words", words.length);

var text = words.join("\n");

fileAccess.write(text, "./data/words-non-standard-lower.txt");
