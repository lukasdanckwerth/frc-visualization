const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");

const json = fileAccess.readCorpusJSON();
const artists = frc.parseArtists(json);

const female = artists.filter((a) => a.sex === "F");
const male = artists.filter((a) => a.sex === "M");
const groups = artists.filter((a) => a.group === "G");

function datasets(artists) {
  return artists.map((a) => {
    return {
      label: a.name,
      data: a.allTracks().map((t) => {
        return {
          value: 1,
          date: t.releaseYear,
          location: a.departementNo,
        };
      }),
    };
  });
}

fileAccess.writeJSON(datasets(artists), "artists.active.range.json");
fileAccess.writeJSON(datasets(male), "artists.active.range.male.json");
fileAccess.writeJSON(datasets(female), "artists.active.range.female.json");
fileAccess.writeJSON(datasets(groups), "artists.active.range.groups.json");
