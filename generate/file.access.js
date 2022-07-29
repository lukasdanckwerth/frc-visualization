const corpusJSONPath = "./data/corpus.json";
const assetsDirectoryPath = "./data";
const fs = require("fs");

function min(name) {
  let parts = name.split(".");
  let extension = parts.pop();
  return parts.join(".") + ".min." + extension;
}

function bytesToSize(bytes) {
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  let formatted = Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  return `${formatted} (${bytes + " bytes"})`;
}

function fileSize(filePath) {
  return fs.statSync(filePath).size;
}

function fileSizeFormatted(filePath) {
  return bytesToSize(fileSize(filePath));
}

function read(url) {
  console.log("[file.access.js] read", url);
  return fs.readFileSync(url) || "";
}

function readJSON(url) {
  return JSON.parse(read(url));
}

function readCorpusJSON() {
  return readJSON(corpusJSONPath);
}

function write(content, url) {
  console.log("[file.access.js] write", url);
  fs.writeFileSync(url, content);
}

function writeAsset(content, name) {
  write(content, assetsDirectoryPath + "/" + name);
}

function writeJSON(json, name) {
  writeAsset(JSON.stringify(json, null, 2), name);
  // writeAsset(JSON.stringify(json), min(name));
}

exports.corpusJSONPath = corpusJSONPath;
exports.assetsDirectoryPath = assetsDirectoryPath;
exports.bytesToSize = bytesToSize;
exports.fileSize = fileSize;
exports.fileSizeFormatted = fileSizeFormatted;
exports.read = read;
exports.readJSON = readJSON;
exports.readCorpusJSON = readCorpusJSON;
exports.write = write;
exports.writeAsset = writeAsset;
exports.writeJSON = writeJSON;
