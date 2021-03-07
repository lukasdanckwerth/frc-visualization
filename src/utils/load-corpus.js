const json = require('./file-access');
const sourceFileURL = 'data/Corpus.json';
console.log('reading corpus');
const corpusJSON = json.read(sourceFileURL);
exports.corpusJSON = corpusJSON;
