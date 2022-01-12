/* generates all assets */

console.log("generate assets");

// require("./datasets.search.js");
require("./datasets.artists.activity.range");
require("./datasets.overview");
require("./datasets.year");
require("./datasets.departement.tracks");
require("./datasets.departement.artists");
require("./copy.assets.js");
require("./about.json");

console.log("finish");
