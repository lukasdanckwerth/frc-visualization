/* generates all assets */

console.log("generate assets");

require("./about.json");
return;

// require("./datasets.search.js");
require("./datasets.artists.activity.range");
require("./datasets.overview");
require("./datasets.year");
require("./datasets.departement.tracks");
require("./datasets.departement.artists");
require("./copy.assets.js");

console.log("finish");
