const fileAccess = require("./file.access");
const frc = require("../dist/frc.js");
const json = fileAccess.readCorpusJSON();

if (
  fileAccess.allAssetsExist(
    "artists.active.range.json",
    "artists.active.range.male.json",
    "artists.active.range.female.json",
    "artists.active.range.groups.json"
  )
) {
  return console.log("skipping creation of artist activity range.");
}

function datasets(artists) {
  return artists.map((a) => {
    return {
      label: a.name,
      data: a
        .allTracks()
        .map((t) => {
          return {
            value: 1,
            date: t.releaseYear,
            location: a.departementNo,
          };
        })
        .reduce((p, c) => {
          let candidate = p.find(
            (d) => d.date === c.date && d.location === c.location
          );
          if (candidate) {
            candidate.value += c.value;
          } else {
            p.push(c);
          }
          return p;
        }, []),
    };
  });
}

const artists = frc.parseArtists(json);
const female = artists.filter((a) => a.sex === "F");
const male = artists.filter((a) => a.sex === "M");
const groups = artists.filter((a) => a.group === "G");

fileAccess.writeJSON(datasets(artists), "artists.active.range.json");
fileAccess.writeJSON(datasets(male), "artists.active.range.male.json");
fileAccess.writeJSON(datasets(female), "artists.active.range.female.json");
fileAccess.writeJSON(datasets(groups), "artists.active.range.groups.json");
