import {Artist} from "./artist";

/**
 *
 * @class Corpus
 */
export class Corpus {

  /**
   * Creates a new instace of Corpus.
   *
   * @param parsedCorpus
   */
  constructor(parsedCorpus) {
    this.artists = [];
    this.initialize(parsedCorpus);
  }

  /**
   *
   * @param parsedCorpus
   */
  initialize(parsedCorpus) {
    for (let i = 0; i < parsedCorpus.length; i++) {
      const artistJSON = parsedCorpus[i];
      const artist = new Artist(artistJSON);
      // const allTracks = artist.allTracks();
      this.artists.push(artist);
    }
  }

  /**
   * Returns an array containing all female artists.
   *
   * @returns {*[]}
   */
  femaleArtists() {
    return this.artists.filter(artist => artist.sex === "F");
  }

  /**
   * Returns an array containing all male artists.
   *
   * @returns {*[]}
   */
  maleArtists() {
    return this.artists.filter(artist => artist.sex === "M");
  }

  /**
   * Returns an array containing all group artists.
   *
   * @returns {*[]}
   */
  groupArtists() {
    return this.artists.filter(artist => artist.group === "G");
  }

  /**
   * Returns an array with all tracks of the corpus.
   *
   * @returns {[]}
   */
  allTracks() {
    let allTracks = [];
    for (let i = 0; i < this.artists.length; i++) {
      allTracks.push(...this.artists[i].allTracks());
    }
    return allTracks;
  }

  /**
   * Returns an array of all words in the corpus.
   *
   * @returns {[]}
   */
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

  /**
   * Returns an array containing all albums in the corpus.
   *
   * @returns {[]}
   */
  allAlbums() {
    let allAlbums = [];
    for (let i = 0; i < this.artists.length; i++) {
      allAlbums.push(...this.artists[i].albums);
    }
    return allAlbums;
  }

  /**
   * Returns an array containing all tracks without an album.
   * @returns {[]}
   */
  allTracksWithoutAlbum() {
    let tracksWithoutAlbum = [];
    for (let i = 0; i < this.artists.length; i++) {
      tracksWithoutAlbum.push(...this.artists[i].tracks);
    }
    return tracksWithoutAlbum;
  }

  /**
   * Returns an array containing all tracks which contains the given word.
   *
   * @param word
   * @param sensitivity
   * @returns {[]}
   */
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

  /**
   * Returns the earliest year in the corpus.
   * @returns {*}
   */
  getEarliestYear() {
    let allTracks = this.allTracks();
    let firstYear = allTracks.find(item => item !== undefined).releaseYear;
    return this.allTracks().reduce((current, next) => current < next.releaseYear ? current : next.releaseYear, firstYear);
  }

  /**
   * Returns the latest year of the corpus.
   * @returns {*}
   */
  getLatestYear() {
    let allTracks = this.allTracks();
    let lastYear = allTracks.find(item => item !== undefined).releaseYear;
    return this.allTracks().reduce((current, next) => current > next.releaseYear ? current : next.releaseYear, lastYear);
  }

  /**
   * Returns departemente meta data.
   * @returns {[]}
   */
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

  /**
   * Returns a year to track collection.
   *
   * @returns {{}}
   */
  getLyricsPerYear() {
    return this.createYearCollection(track => 1);
  }

  /**
   * Returns a year to word collection.
   * @returns {{}}
   */
  getWordsPerYear() {
    return this.createYearCollection((track) => track.components.length);
  }

  /**
   * Returns a year to words collection with relative values.
   * @returns {{}}
   */
  getWordsPerYearRelative() {
    let wordsPerYear = this.getWordsPerYear();
    return this.calculateRelativeValues(wordsPerYear);
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getTypesPerYear() {
    return this.createYearCollection((track) => track.types.length);
  };

  /**
   * Returns a year to types collection with relative values.
   * @returns {{}}
   */
  getTypesPerYearRelative() {
    let typesPerYear = this.getTypesPerYear();
    return this.calculateRelativeValues(typesPerYear);
  };

  /**
   * Returns a year to non standard words collection.
   * @returns {{}}
   */
  getTotalNonStandardPerYearCount() {
    return this.createYearCollection(0);
  };

  /**
   * Return a year to.. collection.
   * @param countFunction
   * @returns {{}}
   */
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

  /**
   * Returns the relative version of the given year to.. collection.
   * @param listPerYear
   * @returns {{}}
   */
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

  /**
   *
   * @param tracks
   * @param startYear
   * @param lastYear
   * @returns {[]}
   */
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

  /**
   *
   * @param tracks
   * @returns {[]}
   */
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
}
