/*!
 * frcv.js v1.0.8
 * undefined
 * (c) 2021 frcv.js Lukas Danckwerth
 * Released under the MIT License
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.frcv = {}));
}(this, (function (exports) { 'use strict';

class Track$1 {
    constructor(trackJSON) {
        this.title = trackJSON.title;
        this.fullTitle = trackJSON.fullTitle;
        this.releaseDate = trackJSON.releaseDate;
        this.releaseYear = trackJSON.releaseYear;
        this.departmentNumber = trackJSON.departmentNumber;
        this.departmentName = trackJSON.departmentName;
        this.id = trackJSON.id;
        this.artistID = trackJSON.artistID;
        this.artist = trackJSON.artist;
        this.content = trackJSON.content;
        if (trackJSON.content) {
            this.components = trackJSON.content
                .replace(/,/g, ' ')
                .replace(/\./g, ' ')
                .replace(/\n/g, ' ')
                .replace(/\(/g, ' ')
                .replace(/\)/g, ' ')
                .replace(/\[/g, ' ')
                .replace(/]/g, ' ')
                .split(" ")
                .filter((word) => word.length > 0);
        } else if (trackJSON.components) {
            this.components = trackJSON.components;
        }
        this.componentsLowercased = this.components.map(item => item.toLowerCase());
        let typesSet = new Set(this.components);
        this.types = Array.from(typesSet);
    }
}

class Album {
    constructor(albumJSON) {
        this.name = albumJSON.name;
        this.tracks = [];
        for (let i = 0; i < albumJSON.tracks.length; i++) {
            const trackJSON = albumJSON.tracks[i];
            const track = new Track$1(trackJSON);
            track.departmentNumber = albumJSON.departmentNo;
            track.departmentName = albumJSON.departmentName;
            track.artistID = albumJSON.geniusId;
            track.artist = albumJSON.name;
            this.tracks.push(track);
        }
    }
}
exports.Album = Album;

class Artist {
  constructor(artistJSON) {
    this.name = artistJSON.name;
    this.geniusId = artistJSON.geniusId;
    this.sex = artistJSON.sex;
    this.group = artistJSON.group;
    this.department = artistJSON.department || artistJSON.departement;
    this.departmentNo = artistJSON.departmentNo || artistJSON.departementNo;
    this.departmentName = (artistJSON.department || artistJSON.departement)
      .split("(")[0]
      .trim()
      .toLowerCase();
    this.albums = [];
    for (let i = 0; i < artistJSON.albums.length; i++) {
      const albumJSON = artistJSON.albums[i];
      albumJSON.departmentNo = this.departmentNo;
      albumJSON.departmentName = this.departmentName;
      albumJSON.artistID = artistJSON.geniusId;
      albumJSON.artist = artistJSON.name;
      const album = new Album(albumJSON);
      album.tracks.forEach(track => track.artistID = artistJSON.geniusId);
      album.tracks.forEach(track => track.artist = artistJSON.name);
      this.albums.push(album);
    }
    this.tracks = [];
    for (let i = 0; i < artistJSON.tracks.length; i++) {
      const trackJSON = artistJSON.tracks[i];
      const track = new Track$1(trackJSON);
      track.departmentNumber = this.departmentNo;
      track.departmentName = this.departmentName;
      track.artistID = artistJSON.geniusId;
      track.artist = artistJSON.name;
      this.tracks.push(track);
    }
  }
  allTracks() {
    let tracks = [];
    for (let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      for (let i = 0; i < album.tracks.length; i++) {
        tracks.push(album.tracks[i]);
      }
    }
    for (let i = 0; i < this.tracks.length; i++) {
      tracks.push(this.tracks[i]);
    }
    return tracks;
  }
  allWords() {
    const allTracks = this.allTracks();
    let allWords = [];
    for (let i = 0; i < allTracks.length; i++) {
      allWords.push(...allTracks[i].components);
    }
    return allWords;
  }
}
exports.Artist = Artist;

class Corpus {
  constructor(parsedCorpus) {
    this.artists = [];
    this.initialize(parsedCorpus);
  }
  initialize(parsedCorpus) {
    for (let i = 0; i < parsedCorpus.length; i++) {
      const artistJSON = parsedCorpus[i];
      const artist = new Artist(artistJSON);
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
  getTracksPerDepartment() {
    return this.createDepartementCollection(track => 1);
  }
  getWordsPerDepartment() {
    return this.createDepartementCollection((track) => track.components.length);
  }
  getWordsPerDepartmentRelative() {
    let wordsPerYear = this.getWordsPerDepartment();
    return this.calculateRelativeDepartmentValues(wordsPerYear);
  };
  getTypesPerDepartment() {
    return this.createDepartementCollection((track) => track.types.length);
  };
  getTypesPerDepartmentRelative() {
    let typesPerYear = this.getTypesPerDepartment();
    return this.calculateRelativeDepartmentValues(typesPerYear);
  };
  createDepartementCollection(countFunction) {
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
  calculateRelativeDepartmentValues(listPerDepartement) {
    let tracksPerDepartment = this.getTracksPerDepartment();
    for (let index = 0; index < listPerDepartement.length; index++) {
      let item = listPerDepartement[index];
      let location = item.location;
      let trackCount = tracksPerDepartment.find(item => item.location === location);
      let itemCount = listPerDepartement.find(item => item.location === location);
      item.value = itemCount.value / trackCount.value;
    }
    return listPerDepartement;
  };
  getChartDataForTracks(tracks, startYear = 1995, lastYear = 2020) {
    let dict = {};
    let labels = [];
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
      items.push({
        year: label,
        value: value,
        yearTotal: yearTotal || 0,
      });
    }
    return items;
  };
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

class FRCDelegate {
  constructor() {
    this.name = 'French Rap Corpus Visualization';
    this.geoJSON = 'assets/Departements.geojson';
    this.dataJSON = 'assets/Corpus-Light.json';
    let delegate = this;
    this.loadData = function (progressFunction) {
      return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.addEventListener("progress", function (event) {
          if (event.lengthComputable) {
            let percentComplete = event.loaded / event.total;
            progressFunction(percentComplete, null);
          } else {
            let message = 'Unable to compute progress information since the total size is unknown';
            progressFunction(null, message);
          }
        }, false);
        req.addEventListener("load", function (event) {
          let rawJSON = event.target.responseText;
          delegate.rawJSON = rawJSON;
          let corpusJSON = JSON.parse(rawJSON);
          let corpus = new Corpus(corpusJSON);
          delegate.corpus = corpus;
          resolve(corpus);
        }, false);
        req.open("GET", delegate.dataJSON);
        req.send();
      })
    }.bind(this);
  }
}
exports.Corpus = Corpus;
exports.Artist = Artist;
exports.Album = Album;
exports.Track = Track$1;

exports.FRCDelegate = FRCDelegate;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=frcv.js.map
