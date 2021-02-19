// use winston for logging - https://github.com/winstonjs/winston
const winston = require('winston');
const frcv = require('../public/js/frcv');
const fs = require('fs');

const logger = winston.createLogger({
    level: "silly",
    format: winston.format.cli(),
    transports: [ new winston.transports.Console() ]
});

function wrapFileWrite(filename, json) {
    fs.writeFile(filename, json, function(err) {
        if(err) {
            logger.error(err);
        } else {
            logger.info("JSON saved to " + filename);
        }
    });
}

logger.info("read corpus");
let corpusJSON = fs.readFileSync('source-data/Corpus.json');
let corpusParsedJSON = JSON.parse(corpusJSON);
let corpus = new frcv.Corpus(corpusParsedJSON);
let corpusJSONString = JSON.stringify(corpus);
logger.info("write corpus");
wrapFileWrite('data/Corpus.json', corpusJSONString);

logger.info("write debug corpus");
let debugArtists = corpus.artists.slice(0, 100);

logger.info("debugArtists: " + debugArtists.length);
wrapFileWrite('data/Corpus-Light.json', JSON.stringify(debugArtists));

let allWords = corpus.allWords();
wrapFileWrite('data/Words.json', JSON.stringify(allWords));

let allTypes = new Set(corpus.allWords());
let allTypesArray = Array.from(allTypes);
wrapFileWrite('data/Types.json', JSON.stringify(allTypesArray));

const about = {};
about.countArtists = corpus.artists.length;
about.countFemaleArtists = corpus.femaleArtists().length;
about.countMaleArtists = corpus.maleArtists().length;
about.countGroupArtists = corpus.groupArtists().length;

about.countAlbums = corpus.allAlbums().length;
about.countTracksWithoutAlbum = corpus.allTracksWithoutAlbum().length;

about.countTracks = corpus.allTracks().length;
about.countWords = corpus.allWords().length;
about.countTypes = new Set(corpus.allWords()).size;

let aboutJSONString = JSON.stringify(about, null, 4);
let aboutFilename = 'data/About.json';
wrapFileWrite(aboutFilename, aboutJSONString);
