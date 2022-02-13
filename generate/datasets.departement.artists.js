const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");

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

function dataset(name, artists, stack) {
  return { label: name, stack: stack || name, data: data(artists) };
}

let datasets = [
  dataset("Females", female, "All"),
  dataset("Males", male, "All"),
  dataset("Groups", groups, "All"),
  dataset("Female Artists", female),
  dataset("Male Artists", male),
  dataset("Group Artists", groups),
];

datasets[0].about =
  "Displays from the corpus the numbers of artists for each department.";

fileAccess.writeJSON(datasets, "department.to.artists.json");
