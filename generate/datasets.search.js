const fileAccess = require("./file.access");
const frc = require("../../public/js/lib/frc.js");
const lotivis = require("../../public/js/lib/lotivis.js");

const json = fileAccess.readCorpusJSON();
const corpus = new frc.Corpus(json);

const searchText = "mif,mif',miff,miff',miffs,mifs,mille-f,mi-f,mi-f','mif'";
const datasets = corpus.search(searchText);

console.log("datasets", datasets);

// json.writeAsset(datasets, "miff.json");
