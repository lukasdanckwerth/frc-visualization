import {Artist} from "./artist";
import {Track} from "./track";

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
   * Returns a year to track collection.
   *
   * @returns {{}}
   */
  getYearsToTrackNumbers() {
    return this.getYearsToCollection(track => 1);
  }

  /**
   * Returns a year to word collection.
   * @returns {{}}
   */
  getYearsToWords() {
    return this.getYearsToCollection((track) => track.components.length);
  }

  /**
   * Returns a year to words collection with relative values.
   * @returns {{}}
   */
  getYearsToWordsRelative() {
    let wordsPerYear = this.getYearsToWords();
    return this.getYearsToCollectionRelative(wordsPerYear);
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getYearsToTypes() {
    return this.getYearsToCollection((track) => track.types.length);
  };

  /**
   * Returns a year to types collection with relative values.
   * @returns {{}}
   */
  getYearsToTypesRelative() {
    let typesPerYear = this.getYearsToTypes();
    return this.getYearsToCollectionRelative(typesPerYear);
  };

  /**
   * Return a year to.. collection.
   * @param countFunction
   * @returns {{}}
   */
  getYearsToCollection(countFunction) {
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
   *
   * @param listPerYear
   * @returns {{}}
   */
  getYearsToCollectionRelative(listPerYear) {
    let lyricsPerYear = this.getYearsToTrackNumbers();
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
   * Returns a departments to year collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTracks() {
    return this.getDepartmentsToCollection(track => 1);
  }

  /**
   * Returns a year to word collection.
   *
   * @returns {{}}
   */
  getDepartmentsToWords() {
    return this.getDepartmentsToCollection((track) => track.components.length);
  }

  /**
   * Returns a year to words collection with relative values.
   *
   * @returns {{}}
   */
  getDepartmentsToWordsRelative() {
    let wordsPerYear = this.getDepartmentsToWords();
    return this.getDepartmentsToCollectionRelative(wordsPerYear);
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTypes() {
    return this.getDepartmentsToCollection((track) => track.types.length);
  };

  /**
   * Returns a year to types collection with relative values.
   *
   * @returns {{}}
   */
  getDepartmentsToTypesRelative() {
    let typesPerYear = this.getDepartmentsToTypes();
    return this.getDepartmentsToCollectionRelative(typesPerYear);
  };

  /**
   * Returns a departement to.. collection.
   *
   * @param countFunction
   * @returns {{}}
   */
  getDepartmentsToCollection(countFunction) {
    let departmentDatasets = [];
    let allTracks = this.allTracks();
    allTracks.forEach(function (track) {
      let location = track.departmentNumber;
      let departmentName = track.departmentName;
      let dataset = departmentDatasets.find(dataset => dataset.location === location);
      if (dataset) {
        dataset.value += countFunction(track);
      } else {
        departmentDatasets.push({
          location: location,
          locationName: departmentName,
          value: countFunction(track)
        });
      }
    });
    return departmentDatasets;
  };

  /**
   * Returns the relative version of the given department to.. collection.
   *
   * @param listPerYear
   * @returns {{}}
   */
  getDepartmentsToCollectionRelative(listPerDepartement) {
    let tracksPerDepartment = this.getDepartmentsToTracks();
    for (let index = 0; index < listPerDepartement.length; index++) {
      let item = listPerDepartement[index];
      let location = item.location;
      let trackCount = tracksPerDepartment.find(item => item.location === location);
      let itemCount = listPerDepartement.find(item => item.location === location);
      item.value = itemCount.value / trackCount.value;
    }

    return listPerDepartement;
  };

  createYearDatasetForTracks(tracks) {
    let yearToAmount = {};
    let includedYears = [];
    if (!this.lyricsPerYear) {
      this.lyricsPerYear = this.getYearsToTrackNumbers();
    }

    for (let i = 0; i < tracks.length; i++) {

      const track = tracks[i];
      const year = track.releaseYear;

      if (yearToAmount[year]) {
        yearToAmount[year] = yearToAmount[year] + 1;
      } else {
        includedYears.push(year);
        yearToAmount[year] = 1;
      }
    }

    includedYears = includedYears.sort();

    let items = [];
    for (let i = 0; i < includedYears.length; i++) {
      const year = includedYears[i];
      const yearTotal = this.lyricsPerYear[year];
      const value = yearToAmount[year] || 0;
      const relativeValue = value / yearTotal;

      items.push({
        date: year,
        dateTotal: yearTotal || 0,
        value: value,
        relativeDateValue: relativeValue
      });
    }
    return items;
  }

  /**
   *
   * @param tracks
   * @returns {[]}
   */
  createDepartmentDatasetForTracks(tracks) {
    let locationToAmount = {};
    let departmentNumbers = [];
    let tracksPerDepartement = this.getDepartmentsToTracks();
    console.log("tracksPerDepartement");
    console.log(tracksPerDepartement);

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const departmentNumber = track.departmentNumber;

      if (!departmentNumbers.includes(departmentNumber)) {
        departmentNumbers.push(departmentNumber);
      }

      if (locationToAmount[departmentNumber]) {
        locationToAmount[departmentNumber] = locationToAmount[departmentNumber] + 1;
      } else {
        locationToAmount[departmentNumber] = 1;
      }
    }

    departmentNumbers = departmentNumbers.sort();

    let items = [];
    for (let i = 0; i < departmentNumbers.length; i++) {
      const departmentNumber = departmentNumbers[i];
      const value = locationToAmount[departmentNumber] || 0;
      items.push({
        location: departmentNumber,
        value: value,
        relativeLocationValue: value
      });
    }

    return items;
  }

  createYearAndDepartmentsDatasetForTracks(tracks) {
    let items = [];
    let yearsToTrackNumbers = this.getYearsToTrackNumbers();
    let tracksPerDepartement = this.getDepartmentsToTracks();

    for (let index = 0; index < tracks.length; index++) {
      let track = tracks[index];
      let year = track.releaseYear;
      let department = track.departmentNumber;

      let entry = items.find(function (item) {
        return item.location === department
          && item.date === year;
      });

      if (entry) {
        entry.value += 1;
      } else {
        let departmentEntry = tracksPerDepartement.find(entry => entry.location === department);
        items.push({
          location: department,
          date: year,
          value: 1,
          dateTotal: yearsToTrackNumbers[year],
          locationTotal: departmentEntry.value,
        })
      }
    }

    return items;
  }
}
