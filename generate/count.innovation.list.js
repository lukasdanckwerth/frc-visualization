let fileAccess = require("./file.access");

// let filePathAllWords = "./data/corpus-non-standard-lower.words.txt";
let filePathAllWords = "./data/corpus.words.txt";

let filePathSource = "./data/innovation.list.v2.txt";

let allWords = fileAccess.read(filePathAllWords).toString().split("\n");
let wordsWithNoOccurences = [];
let sourceList = fileAccess
  .read(filePathSource)
  .toString()
  .split("\n")
  .filter((word) => word.trim().length > 0);

function countOccurences(inputWord) {
  return allWords.filter((word) => word === inputWord).length;
}

let csvContent = "mainform;variation;count;details\n";
let allCount = sourceList.length;

for (let index = 0; index < sourceList.length; index++) {
  let line = sourceList[index];
  let variants = line
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  variants = Array.from(new Set(variants));

  console.log(index, allCount, variants.join(", "));

  if (variants.length > 1) {
    let sumAllVariants = 0;
    let variantsToCount = {};

    // iterate and count
    for (let index2 = 0; index2 < variants.length; index2++) {
      let variant = variants[index2];
      let count = countOccurences(variant);
      sumAllVariants += count;
      variantsToCount[variant] = count;
    }

    // sort
    let sortable = [];
    for (const variant in variantsToCount) {
      sortable.push([variant, variantsToCount[variant]]);
    }

    let sorted = sortable.sort((a, b) => b[1] - a[1]);
    let mainform = sorted[0][0];
    let variantsSorted = sorted.map((entry) => entry[0]);
    let variantsFormatted = variantsSorted.join(", ");
    let details = sorted.map((entry) => `${entry[0]} (${entry[1]})`).join(", ");

    csvContent += `${mainform};${variantsFormatted};${sumAllVariants};${details}\n`;
  } else {
    let word = variants[0];
    let count = countOccurences(word);

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

let targetPathCSV = filePathSource + ".freqences.csv";
let targetPathNoOccurences = filePathSource + ".no.occurences.txt";

fileAccess.write(wordsWithNoOccurences.join("\n"), targetPathNoOccurences);
fileAccess.write(csvContent, targetPathCSV);
