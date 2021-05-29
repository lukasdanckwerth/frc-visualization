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

function writeTXT(content, name) {
  fs.writeFileSync('./public/assets/' + name, content);
}

/**
 * Writes the given raw content to the given URL.
 *
 * @param json The json object.
 * @param url The url of the file.
 * @param minify Indicates whether to use a minified JSON version.
 */
function writeJSON(json, url, minify = true) {
  console.log('start writing to ' + url);
  let content;
  if (minify) {
    content = JSON.stringify(json);
  } else {
    content = JSON.stringify(json, null, 2);
  }
  fs.writeFileSync(url, content);
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

function readTXT(url) {
  return fs.readFileSync(url) || "";
}

exports.writeAsset = writeAsset;
exports.write = writeJSON;
exports.writeTXT = writeTXT;
exports.read = readJSON;
exports.readTXT = readTXT;
