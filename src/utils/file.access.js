const fs = require('fs');

/**
 * Writes the given json to the assets directory.
 *
 * @param json The json object to write.
 * @param name The name of the file.
 */
function writeAsset(json, name) {
  writeJSON(json, './public/assets/' + name);
}

/**
 * Writes the given raw content to the given URL.
 *
 * @param json The json object.
 * @param url The url of the file.
 */
function writeJSON(json, url) {
  console.log('start writing to ' + url);
  let content = JSON.stringify(json, null, 2);
  let contentMin = JSON.stringify(json);
  let urlMin = String(url).replace('.json', '.min.json');
  fs.writeFileSync(url, content);
  fs.writeFileSync(urlMin, contentMin);
}

/**
 * Reads a json from the given url.
 *
 * @param url The url of the JSON file.
 * @returns {any}
 */
function readJSON(url) {
  return JSON.parse(fs.readFileSync(url) || "");
}

exports.writeAsset = writeAsset;
exports.write = writeJSON;
exports.read = readJSON;
