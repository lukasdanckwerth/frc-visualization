const json = require('./file.access');
const sourceFileURL = 'data/corpus.json';
console.log('reading corpus');
const corpusJSON = json.read(sourceFileURL);
exports.corpusJSON = corpusJSON;
