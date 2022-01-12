const fileAccess = require("./file.access");

const departements = fileAccess.readJSON("data/departements.geojson");
fileAccess.writeJSON(departements, "departements.geojson");

const innovationList = fileAccess.read("data/innovation.list.txt");
fileAccess.writeAsset(innovationList, "innovation.list.txt");

const json = fileAccess.readCorpusJSON();
fileAccess.writeJSON(json, "corpus.json");
fileAccess.writeJSON(json.slice(0, 100), "corpus.light.json");
