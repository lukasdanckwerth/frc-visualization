const sourceFileURL = "data/corpus.json";
const assetsDirectory = "./public/assets/";

const fs = require("fs");
const frcv = require("../public/js/lib/frc");

function bytesToSize(bytes) {
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  let formatted = Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  return `${formatted} (${bytes + " bytes"})`;
}

function fileSize(filePath) {
  return bytesToSize(fs.statSync(filePath).size);
}

/**
 * Writes the given json to the assets directory.
 *
 * @param json The json object to write.
 * @param name The name of the file.
 */
function writeAsset(json, name, minify = true) {
  writeJSON(json, assetsDirectory + name, minify);
}

function writeTXT(content, name) {
  fs.writeFileSync(assetsDirectory + name, content);
}

/**
 * Writes the given raw content to the given URL.
 *
 * @param json The json object.
 * @param url The url of the file.
 * @param minify Indicates whether to use a minified JSON version.
 */
function writeJSON(json, url, minify = true) {
  console.log("[write] " + url);
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

function readCorpusJSON() {
  console.log("[file.access.js] Reading corpus");
  return readJSON(sourceFileURL);
}

function readCorpus() {
  console.log("[file.access.js] Creating corpus model");
  return new frcv(readCorpusJSON());
}

const corpus = readCorpus();

exports.bytesToSize = bytesToSize;
exports.fileSize = fileSize;
exports.writeAsset = writeAsset;
exports.write = writeJSON;
exports.writeTXT = writeTXT;
exports.read = readJSON;
exports.readTXT = readTXT;
exports.readCorpusJSON = readCorpusJSON;
exports.readCorpus = readCorpus;
exports.corpus = corpus;
