const fileAccess = require("./file.access");
const frc = require("../public/js/lib/frc.js");

const json = fileAccess.readCorpusJSON();
const artists = frc.parseArtists(json);

const female = artists.filter((a) => a.sex === "F");
const male = artists.filter((a) => a.sex === "M");
const groups = artists.filter((a) => a.group === "G");

function data(countsFn) {
    let data = [];
    for (let a, candidate, i = 0; i < artists.length; i++) {
        a = artists[i];
        if (!a) throw new Error("artist invalid: " + i);
        if (!a.departementNo) throw new Error("no departement no: " + i);
        candidate = data.find((d) => d.location === a.departementNo);
        if (candidate) {
            if (countsFn(a)) candidate.value += 1;
        } else {
            data.push({
                location: "" + a.departementNo,
                value: countsFn(a) ? 1 : 0,
            });
        }
    }
    return data;
}

function dataset(name, group, countsFn) {
    return { label: name, group: group || name, data: data(countsFn) };
}

let datasets = [
    dataset("Females", "All", (a) => a.sex === "F"),
    dataset("Males", "All", (a) => a.sex === "M"),
    dataset("Groups", "All", (a) => a.group === "G"),
    dataset("Female Artists", null, (a) => a.sex === "F"),
    dataset("Male Artists", null, (a) => a.sex === "M"),
    dataset("Group Artists", null, (a) => a.group === "G"),
];

datasets[0].about =
    "Displays from the corpus the numbers of artists for each department.";

fileAccess.writeJSON(datasets, "department.to.artists.json");
