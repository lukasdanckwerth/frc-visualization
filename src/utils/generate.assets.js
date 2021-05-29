/*
 Generates all assets.
 */
// require('./generate.corpus.json');
// require('./generate.artists.active.range');
// require('./generate.overview.datasets');
// require('./generate.year.relation.datasets');
// require('./generate.departement.relation.datasets');

const fileAccess = require('./file.access');

const departements = fileAccess.read('data/departements.geojson');
fileAccess.writeAsset(departements, 'departements.geojson');

const innovationList = fileAccess.readTXT('data/innovation.list.txt');
fileAccess.writeTXT(innovationList, 'innovation.list.txt');

console.log('Finish.');
