/**
 *
 * @class Corpus
 */
class Corpus {

    /**
     * Creates a new instace of Corpus.
     *
     * @param parsedCorpus
     */
    constructor(parsedCorpus) {
        this.artists = [];
        this.initialize(parsedCorpus);
    }

    initialize(parsedCorpus) {
        for (let i = 0; i < parsedCorpus.length; i++) {
            const artistJSON = parsedCorpus[i];
            const artist = new Artist(artistJSON);
            // const allTracks = artist.allTracks();
            this.artists.push(artist);
        }
    }

    femaleArtists() {
        return this.artists.filter(artist => artist.sex === "F");
    }

    maleArtists() {
        return this.artists.filter(artist => artist.sex === "M");
    }

    groupArtists() {
        return this.artists.filter(artist => artist.group === "G");
    }

    allTracks() {
        let allTracks = [];
        for (let i = 0; i < this.artists.length; i++) {
            allTracks.push(...this.artists[i].allTracks());
        }
        return allTracks;
    }

    allWords() {
        let allWords = [];
        for (let i = 0; i < this.artists.length; i++) {
            let wordsOfArtist = this.artists[i].allWords();
            for (let i = 0; i < wordsOfArtist.length; i++) {
                allWords.push(wordsOfArtist[i]);
            }
        }
        return allWords;
    }

    allAlbums() {
        let allAlbums = [];
        for (let i = 0; i < this.artists.length; i++) {
            allAlbums.push(...this.artists[i].albums);
        }
        return allAlbums;
    }

    allTracksWithoutAlbum() {
        let tracksWithoutAlbum = [];
        for (let i = 0; i < this.artists.length; i++) {
            tracksWithoutAlbum.push(...this.artists[i].tracks);
        }
        return tracksWithoutAlbum;
    }

    tracksForWord(word, sensitivity = 'case-sensitive') {
        let tracks = [];
        const allTracks = this.allTracks();

        if (sensitivity === 'case-sensitive') {
            for (let i = 0; i < allTracks.length; i++) {
                if (allTracks[i].components.indexOf(word) !== -1) {
                    tracks.push(new Track(allTracks[i]));
                }
            }
        } else if (sensitivity === 'case-insensitive') {
            word = word.toLowerCase();
            for (let i = 0; i < allTracks.length; i++) {
                if (allTracks[i].componentsLowercased.indexOf(word) !== -1) {
                    tracks.push(new Track(allTracks[i]));
                }
            }
        }

        return tracks;
    }

    getEarliestYear() {
        let allTracks = this.allTracks();
        let firstYear = allTracks.find(item => item !== undefined).releaseYear;
        return this.allTracks().reduce((current, next) => current < next.releaseYear ? current : next.releaseYear, firstYear);
    }

    getLatestYear() {
        let allTracks = this.allTracks();
        let lastYear = allTracks.find(item => item !== undefined).releaseYear;
        return this.allTracks().reduce((current, next) => current > next.releaseYear ? current : next.releaseYear, lastYear);
    }

    getDepartementsData() {
        let departmentDatasets = [];
        let allTracks = this.allTracks();
        allTracks.forEach(function (track) {
            let departmentNumber = track.departmentNumber;
            let departmentName = track.departmentName;
            let dataset = departmentDatasets.find(dataset => dataset.departmentNumber === departmentNumber);
            if (dataset) {
                dataset.value += 1;
            } else {
                departmentDatasets.push({
                    departmentNumber: departmentNumber,
                    departmentName: departmentName,
                    value: 1
                });
            }
        });

        return departmentDatasets;
    }

    getMapDataForTracks(tracks) {
        let dict = {};
        let departmentNumbers = [];

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const departmentNumber = track.departmentNumber;

            if (!departmentNumbers.includes(departmentNumber)) {
                departmentNumbers.push(departmentNumber);
            }

            if (dict[departmentNumber]) {
                dict[departmentNumber] = dict[departmentNumber] + 1;
            } else {
                dict[departmentNumber] = 1;
            }
        }

        departmentNumbers = departmentNumbers.sort();

        let items = [];
        for (let i = 0; i < departmentNumbers.length; i++) {
            const departmentNumber = departmentNumbers[i];
            const value = dict[departmentNumber] || 0;
            items.push({
                dlabel: departmentNumber,
                value: value,
            });
        }

        return items;
    }

    getLyricsPerYear() {
        return this.createYearCollection(track => 1);
    }

    getWordsPerYear() {
        return this.createYearCollection((track) => track.components.length);
    }

    getWordsPerYearRelative() {
        let wordsPerYear = this.getWordsPerYear();
        return this.calculateRelativeValues(wordsPerYear);
    };

    getTypesPerYear() {
        return this.createYearCollection((track) => track.types.length);
    };

    getTypesPerYearRelative() {
        let typesPerYear = this.getTypesPerYear();
        return this.calculateRelativeValues(typesPerYear);
    };

    getTotalNonStandardPerYearCount() {
        return this.createYearCollection(0);
    };

    createYearCollection(countFunction) {
        let allTracks = this.allTracks();
        let yearCollection = {};
        for (let i = 0; i < allTracks.length; i++) {
            const track = allTracks[i];
            const year = track.releaseYear;
            if (yearCollection[year]) {
                yearCollection[year] = yearCollection[year] + countFunction(track);
            } else {
                yearCollection[year] = countFunction(track);
            }
        }
        return yearCollection;
    };

    calculateRelativeValues(listPerYear) {
        let lyricsPerYear = this.getLyricsPerYear();
        let yearCollection = {};
        for (const yearKey in lyricsPerYear) {
            if (lyricsPerYear.hasOwnProperty(yearKey)) {
                let lyricsCount = lyricsPerYear[yearKey];
                let wordsCount = listPerYear[yearKey];
                yearCollection[yearKey] = wordsCount / lyricsCount;
            }
        }
        return yearCollection;
    };

    getChartDataForTracks(tracks, startYear = 1995, lastYear = 2020) {
        let dict = {};
        let labels = [];
        let values = [];
        let valuesTotal = [];
        let yearsTotal = [];

        for (let year = startYear; year <= lastYear; year++) {
            dict[year] = 0;
            labels.push(year);
        }

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const year = track.releaseYear;
            if (dict[year]) {
                dict[year] = dict[year] + 1;
            } else {
                dict[year] = 1;
            }
        }
        labels = labels.sort();
        if (!this.lyricsPerYear) {
            this.lyricsPerYear = this.getLyricsPerYear();
        }
        let items = [];
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            const value = dict[label] || 0;
            const yearTotal = this.lyricsPerYear[label];
            const relativeValue = value / yearTotal;
            let relativeOrAbsolute = 'relative';
            if (relativeOrAbsolute === 'relative') {
                values.push(relativeValue);
            } else {
                values.push(value);
            }
            valuesTotal.push(value);
            yearsTotal.push(yearTotal);
            items.push({
                // label: label,
                year: label,
                value: value,
                yearTotal: yearTotal || 0,
            });
        }
        return items;
    };
}
