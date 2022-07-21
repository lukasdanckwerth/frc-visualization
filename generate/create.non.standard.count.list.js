let fileAccess = require("./file.access");

let startDate = new Date();
console.log("startDate", startDate);

// let filePathAllWords = "./data/words-non-standard-lower.txt";
let filePathAllWords = "./data/words.txt";
let allWords = fileAccess.read(filePathAllWords).toString().split("\n");

let wordsWithNoOccurences = [];

console.log("allWords", allWords.length);

let filePathSource = "./data/non.standard.alphabetically.txt";
let sourceList = fileAccess
    .read(filePathSource)
    .toString()
    .split("\n")
    .filter((word) => word.trim().length > 0);

let csvContent = "mainform;variation;count;details\n";

function countOccurences(inputWord) {
    return allWords.filter((word) => word === inputWord).length;
}

let allCount = sourceList.length;

for (let index = 0; index < sourceList.length; index++) {
    let elapsedTime = new Date() - startDate;
    let perThousedMillies = (index + 1) / elapsedTime;

    let line = sourceList[index];
    let variants = line
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

    let toDo = allCount - index;
    let milliesEta = toDo * perThousedMillies;
    let eta = new Date(milliesEta + 3600).toISOString().substr(11, 8);

    console.log(index, eta, "secs till end", variants.join(", "));

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
        let details = sorted
            .map((entry) => `${entry[0]} (${entry[1]})`)
            .join(", ");

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
}

fileAccess.write(
    wordsWithNoOccurences.join("\n"),
    "./data/words.with.no.occurences.txt"
);
fileAccess.write(csvContent, "./data/non.standard.freqences.csv");
