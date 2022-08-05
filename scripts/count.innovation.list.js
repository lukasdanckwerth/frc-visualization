const fileAccess = require("./file.access");
const frc = require("../dist/frc.js");
const innovationLists = require("../data/innovation-lists.json");

console.log("innovationLists", innovationLists);

const json = fileAccess.readCorpusJSON();
const tracks = frc.parseTracks(json);

console.log("tracks", tracks.length);

function countTypes(input) {
  return tracks.filter((t) => t.tokensLower.indexOf(input) !== -1).length;
}

function handleList(filename) {
  let wordsWithNoOccurences = [];
  let sourceList = fileAccess
    .read("./data/innovation-lists/" + filename)
    .toString()
    .split("\n")
    .filter((word) => word.trim().length > 0);

  let csvContent = "mainform;variation;count;details\n";
  let allCount = sourceList.length;

  for (let index = 0; index < sourceList.length; index++) {
    let line = sourceList[index];
    let variants = line
      .split(",")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 0);

    variants = Array.from(new Set(variants));

    console.log(index, allCount, variants.join(", "));

    if (variants.length > 1) {
      let sumAllVariants = 0;
      let variantsToCount = {};

      // iterate and count
      for (let index2 = 0; index2 < variants.length; index2++) {
        let variant = variants[index2];
        let count = countTypes(variant);
        sumAllVariants += count;
        variantsToCount[variant] = count;
      }

      // sort
      let sortable = [];
      for (const variant in variantsToCount) {
        sortable.push([variant, variantsToCount[variant]]);
      }

      // sort and filter out words with no occurences
      let sorted = sortable
        .sort((a, b) => b[1] - a[1])
        .filter((item) => {
          let word = item[0];
          let value = item[1];
          if (value === 0) wordsWithNoOccurences.push(word);
          return value > 0;
        });

      let mainform = sorted[0][0];
      let variantsSorted = sorted.map((entry) => entry[0]);
      let variantsFormatted = variantsSorted.join(", ");
      let details = sorted
        .map((entry) => `${entry[0]} (${entry[1]})`)
        .join(", ");

      csvContent += `${mainform};${variantsFormatted};${sumAllVariants};${details}\n`;
    } else {
      let word = variants[0];
      let count = countTypes(word);

      if (count) {
        csvContent += `${word};${word};${count};\n`;
      } else {
        console.log("no occurences of: " + word);
        wordsWithNoOccurences.push(word);
      }
    }

    // if (index > 5) {
    //   break;
    // }
  }

  let targetPathCSV =
    "./data/innovation-lists-frequencies/" + filename + ".csv";
  let targetPathNoOccurences =
    "./data/innovation-lists-no-occurences/" + filename;

  fileAccess.write(csvContent, targetPathCSV);
  fileAccess.write(wordsWithNoOccurences.join("\n"), targetPathNoOccurences);
}

innovationLists.forEach(handleList);
