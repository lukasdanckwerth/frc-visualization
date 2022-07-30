const fileAccess = require("./file.access");
const frc = require("../dist/frc.js");

const json = fileAccess.readCorpusJSON();
const tracks = frc.parseTracks(json);

function data(tracks, value) {
  let data = [];
  for (let t, candidate, i = 0; i < tracks.length; i++) {
    t = tracks[i];
    if (!t) throw new Error("track invalid: " + i);
    if (!t.departementNo) throw new Error("no departement no: " + i);
    candidate = data.find(
      (d) => d.date === t.releaseYear && d.location === t.departementNo
    );
    if (candidate) {
      candidate.value += value(t);
    } else {
      data.push({
        date: t.releaseYear,
        location: "" + t.departementNo,
        value: value(t),
      });
    }
  }
  return data;
}

fileAccess.writeJSON(
  { label: "Tracks", data: data(tracks, (t) => 1) },
  "overview.tracks.json"
);

fileAccess.writeJSON(
  { label: "Tokens", data: data(tracks, (t) => t.tokens.length) },
  "overview.tokens.json"
);

fileAccess.writeJSON(
  { label: "Types", data: data(tracks, (t) => t.types.length) },
  "overview.types.json"
);
