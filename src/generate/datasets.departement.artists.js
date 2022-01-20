const fileAccess = require("./file.access");
const frc = require("../../public/js/lib/frc.js");

const json = fileAccess.readCorpusJSON();
const artists = frc.parseArtists(json);

const female = artists.filter((a) => a.sex === "F");
const male = artists.filter((a) => a.sex === "M");
const groups = artists.filter((a) => a.group === "G");

function data(artists) {
  let data = [];
  for (let a, candidate, i = 0; i < artists.length; i++) {
    a = artists[i];
    if (!a) throw new Error("artist invalid: " + i);
    if (!a.departementNo) throw new Error("no departement no: " + i);
    candidate = data.find((d) => d.location === a.departementNo);
    if (candidate) {
      candidate.value += 1;
    } else {
      data.push({
        location: "" + a.departementNo,
        value: 1,
      });
    }
  }
  return data;
}

function dataset(name, artists) {
  return { label: name, stack: name, data: data(artists) };
}

fileAccess.writeJSON(
  dataset("Artists", artists),
  "departements.to.artists.json"
);

fileAccess.writeJSON(
  dataset("Female Artist", female),
  "departements.to.female.artists.json"
);

fileAccess.writeJSON(
  dataset("Male Artist", male),
  "departements.to.male.artists.json"
);

fileAccess.writeJSON(
  dataset("Group Artists", groups),
  "departements.to.group.artists.json"
);
