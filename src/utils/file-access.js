const fs = require('fs');

/**
 * Writes the given json to the assets directory.
 *
 * @param json The json object to write.
 * @param name The name of the file.
 */
function writeAsset(json, name) {
  writeJSON(json, './docs/assets/' + name);
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
  fs.writeFile(url, content, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log("did write to " + url)
    }
  });
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
