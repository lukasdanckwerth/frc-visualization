import {Artist} from "./artist";
import {
  getYearsToCollection,
  getYearsToCollectionRelative
} from "../access/year-relations";
import {
  getDepartmentsToCollection,
  getDepartmentsToCollectionRelative
} from "../access/department-relations";
import {
  internalSearch
} from "../access/search";
import {tracksForYears} from "../access/tracks-access";
import {artistsForLocations} from "../access/artists-for-locations";

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
    let firstDate = this.getEarliestYear();
    let lastDate = this.getLatestYear();
    let range = lastDate - firstDate + 1;
    return Array(range).fill(0).map((e, i) => i + firstDate);
  }

  /**
   * Returns a year to track collection.
   *
   * @returns {{}}
   */
  getYearsToTrackNumbers() {
    return getYearsToCollection(this, () => 1);
  }

  /**
   * Returns a year to word collection.
   * @returns {{}}
   */
  getYearsToWords() {
    return getYearsToCollection(this, (track) => track.components.length);
  }

  /**
   * Returns a year to words collection with relative values.
   * @returns {{}}
   */
  getYearsToWordsRelative() {
    return getYearsToCollectionRelative(this, this.getYearsToWords());
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getYearsToTypes() {
    return getYearsToCollection(this, (track) => track.types.length);
  };

  /**
   * Returns a year to types collection with relative values.
   * @returns {{}}
   */
  getYearsToTypesRelative() {
    return getYearsToCollectionRelative(this, this.getYearsToTypes());
  };

  /**
   * Returns a departments to year collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTracks() {
    return getDepartmentsToCollection(this, () => 1);
  }

  /**
   * Returns a departmen to word collection.
   *
   * @returns {{}}
   */
  getDepartmentsToWords() {
    return getDepartmentsToCollection(this, (track) => track.components.length);
  }

  /**
   * Returns a year to words collection with relative values.
   *
   * @returns {{}}
   */
  getDepartmentsToWordsRelative() {
    return getDepartmentsToCollectionRelative(this, this.getDepartmentsToWords());
  };

  /**
   * Returns a year to types collection.
   *
   * @returns {{}}
   */
  getDepartmentsToTypes() {
    return getDepartmentsToCollection(this, (track) => track.types.length);
  };

  /**
   * Returns a year to types collection with relative values.
   *
   * @returns {{}}
   */
  getDepartmentsToTypesRelative() {
    return getDepartmentsToCollectionRelative(this, this.getDepartmentsToTypes());
  };

  /**
   *
   * @param years
   * @returns {*}
   */
  getTracksForYears(years) {
    return tracksForYears(this, years);
  }

  /**
   *
   * @param locations
   * @returns {*}
   */
  getArtistsForLocations(locations) {
    return artistsForLocations(this, locations);
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
