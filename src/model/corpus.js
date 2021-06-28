import {Artist} from "./artist";
import {
  getYearsToCollectionRelative, getYearsToTracksCollection
} from "./corpus.datasets.year";
import {
  getDepartmentsToTracksCollection,
  getDepartmentsToArtistsCollection,
  getDepartmentsToTracksCollectionRelative
} from "./corpus.datasets.departement";
import {
  internalSearch
} from "./corpus.search";

/**
 *
 * @class Corpus
 */
export class Corpus {

  /**
   * Creates a new instance of Corpus.
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
    console.log(`frc parse corpus`);
    for (let i = 0; i < parsedCorpus.length; i++) {
      const artistJSON = parsedCorpus[i];
      const artist = new Artist(artistJSON);
      this.artists.push(artist);
    }
    console.log(`frc loaded corpus`);
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
      let artistTracks = this.artists[i].allTracks();
      for (let i = 0; i < artistTracks.length; i++) {
        allTracks.push(artistTracks[i]);
      }
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
    return this.allTracks()
      .reduce((current, next) => current > next.releaseYear ? current : next.releaseYear, lastYear);
  }

  getDateLabels() {
    let firstDate = this.firstYear || this.getEarliestYear();
    let lastDate = this.lastYear || this.getLatestYear();
    let range = lastDate - firstDate + 1;
    return Array(range).fill(0).map((e, i) => i + firstDate);
  }

  getLocations() {
    return Array.from(new Set(this.artists.map(artist => artist.departmentNo)));
  }

  getLocationNames() {
    return Array.from(new Set(this.artists.map(artist => artist.departmentName)));
  }

  /**
   * Returns a year to track collection.
   *
   * @returns {{}}
   */
  getYearsToTrackNumbers() {
    return getYearsToTracksCollection(this.allTracks(), () => 1);
  }

  /**
   * Returns a year to word collection.
   * @returns {{}}
   */
  getYearsToWords() {
    return getYearsToTracksCollection(this.allTracks(), (track) => track.components.length);
  }

  /**
   * Returns a year to words collection with relative values.
   * @returns {{}}
   */
  getYearsToWordsRelative() {
    return getYearsToCollectionRelative(this.getYearsToWords(), this.getYearsToTrackNumbers());
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getYearsToTypes() {
    return getYearsToTracksCollection(this.allTracks(), (track) => track.types.length);
  };

  /**
   * Returns a year to types collection with relative values.
   * @returns {{}}
   */
  getYearsToTypesRelative() {
    return getYearsToCollectionRelative(this.getYearsToTypes(), this.getYearsToTrackNumbers());
  };


  getDepartmentsToArtists() {
    return getDepartmentsToArtistsCollection(this.getDepartmentsToTracks(), this.artists, () => 1);
  }

  getDepartmentsToMaleArtists() {
    return getDepartmentsToArtistsCollection(this.getDepartmentsToTracks(), this.maleArtists(), () => 1);
  }

  getDepartmentsToFemaleArtists() {
    return getDepartmentsToArtistsCollection(this.getDepartmentsToTracks(), this.femaleArtists(), () => 1);
  }

  getDepartmentsToGroupArtists() {
    return getDepartmentsToArtistsCollection(this.getDepartmentsToTracks(), this.groupArtists(), () => 1);
  }

  /**
   * Returns a departments to year collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTracks() {
    return getDepartmentsToTracksCollection(null, this.allTracks(), () => 1);
  }

  /**
   * Returns a departmen to word collection.
   *
   * @returns {{}}
   */
  getDepartmentsToWords() {
    return getDepartmentsToTracksCollection(this.getDepartmentsToTracks(), this.allTracks(), (track) => track.components.length);
  }

  /**
   * Returns a year to words collection.
   *
   * @returns {{}}
   */
  getDepartmentsToWordsRelative() {
    return getDepartmentsToTracksCollectionRelative(
      this.getDepartmentsToWords(), this.getDepartmentsToTracks()
    );
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTypes() {
    return getDepartmentsToTracksCollection(this.getDepartmentsToTracks(), this.allTracks(), (track) => track.types.length);
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTypesRelative() {
    return getDepartmentsToTracksCollectionRelative(
      this.getDepartmentsToTypes(), this.getDepartmentsToTracks()
    );
  };

  /**
   *
   * @param years
   * @returns {*}
   */
  getTracksForYears(years) {
    return this.allTracks().filter(track => years.includes(track.releaseYear));
  }

  getTracks(firstYear, lastYear) {
    return this.allTracks().filter(track => track.releaseYear >= firstYear && track.releaseYear <= lastYear);
  }

  getTracksForYearAndDepartement(year, departmentNumber) {
    return this.allTracks().filter(track => track.releaseYear === year && track.departmentNumber === departmentNumber);
  }

  tracksForLocations(departmentNumbers) {
    this.allTracks().filter(track => departmentNumbers.includes(track.departmentNumber));
  }

  artistsForLocations(departmentNumbers) {
    return this.artists.filter(artist => departmentNumbers.includes(String(artist.departmentNo)));
  }

  /**
   *
   * @param searchQuery
   * @param firstYear
   * @param lastYear
   * @param sensitivity
   * @param absolute
   * @returns {*[]}
   */
  search(searchQuery, firstYear, lastYear, sensitivity, absolute) {
    return internalSearch(this, searchQuery, firstYear, lastYear, sensitivity, absolute);
  }
}
