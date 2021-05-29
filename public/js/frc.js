/*!
 * frc.js v1.0.35 Lukas Danckwerth
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
typeof define === 'function' && define.amd ? define(factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.frc = factory());
}(this, (function () { 'use strict';

class Track {
  constructor(trackJSON) {
    this.title = trackJSON.title;
    this.fullTitle = trackJSON.fullTitle;
    this.releaseDate = trackJSON.releaseDate;
    this.releaseYear = trackJSON.releaseYear;
    this.departmentNumber = trackJSON.departmentNumber;
    this.departmentName = trackJSON.departmentName;
    this.id = trackJSON.id;
    this.url = trackJSON.url;
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
      const track = new Track(trackJSON);
      track.departmentNumber = albumJSON.departmentNo;
      track.departmentName = albumJSON.departmentName;
      track.artistID = albumJSON.geniusId;
      track.artist = albumJSON.name;
      this.tracks.push(track);
    }
  }
}

class Artist {
  constructor(rawJSON) {
    this.name = rawJSON.name;
    this.geniusId = rawJSON.geniusId;
    this.sex = rawJSON.sex;
    this.group = rawJSON.group;
    this.department = rawJSON.department || rawJSON.departement;
    this.departmentNo = rawJSON.departmentNo || rawJSON.departementNo;
    this.departmentName = (rawJSON.department || rawJSON.departement)
      .split("(")[0]
      .trim()
      .toLowerCase();
    this.albums = [];
    for (let i = 0; i < rawJSON.albums.length; i++) {
      const albumJSON = rawJSON.albums[i];
      albumJSON.departmentNo = this.departmentNo;
      albumJSON.departmentName = this.departmentName;
      albumJSON.artistID = rawJSON.geniusId;
      albumJSON.artist = rawJSON.name;
      const album = new Album(albumJSON);
      album.tracks.forEach(track => track.artistID = rawJSON.geniusId);
      album.tracks.forEach(track => track.artist = rawJSON.name);
      this.albums.push(album);
    }
    this.tracks = [];
    for (let i = 0; i < rawJSON.tracks.length; i++) {
      const trackJSON = rawJSON.tracks[i];
      const track = new Track(trackJSON);
      track.departmentNumber = this.departmentNo;
      track.departmentName = this.departmentName;
      track.artistID = rawJSON.geniusId;
      track.artist = rawJSON.name;
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

function getYearsToCollection(corpus, countFunction) {
  let allTracks = corpus.allTracks();
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
}
function getYearsToCollectionRelative(corpus, listPerYear) {
  let lyricsPerYear = corpus.getYearsToTrackNumbers();
  let yearCollection = {};
  for (const yearKey in lyricsPerYear) {
    if (lyricsPerYear.hasOwnProperty(yearKey)) {
      let lyricsCount = lyricsPerYear[yearKey];
      let wordsCount = listPerYear[yearKey];
      yearCollection[yearKey] = wordsCount / lyricsCount;
    }
  }
  return yearCollection;
}

function getDepartmentsToCollection(corpus, countFunction) {
  let departmentDatasets = [];
  let allTracks = corpus.allTracks();
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
}
function getDepartmentsToCollectionRelative(corpus, listPerDepartement) {
  let tracksPerDepartment = corpus.getDepartmentsToTracks();
  for (let index = 0; index < listPerDepartement.length; index++) {
    let item = listPerDepartement[index];
    let location = item.location;
    let trackCount = tracksPerDepartment.find(item => item.location === location);
    let itemCount = listPerDepartement.find(item => item.location === location);
    item.value = itemCount.value / trackCount.value;
  }
  return listPerDepartement;
}

function internalSearch(corpus, searchQuery, firstYear, lastYear, sensitivity, absolute) {
  let theFirstYear = firstYear || corpus.getEarliestYear();
  let theLastYear = lastYear || corpus.getLatestYear();
  let theSensitivity = sensitivity || 'case-insensitive';
  let theAbsolute = absolute || 'relative';
  let groups = searchQuery.split(';').map(value => value.trim());
  groups = groups.map(group => group.split(',').map(word => word.trim()).join(','));
  groups = groups.map(group => group.trim());
  let datasets = [];
  let tracksObject = {};
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i];
    let words = group.split(',').map(value => value.trim());
    let stack = words.join(", ");
    for (let j = 0; j < words.length; j++) {
      let searchWord = words[j];
      let dataset = datasetFor(
        corpus,
        searchWord,
        stack,
        theFirstYear,
        theLastYear,
        theSensitivity,
        theAbsolute
      );
      tracksObject[searchWord] = dataset.tracks;
      dataset.tracks = null;
      datasets.push(dataset);
    }
  }
  datasets.tracks = tracksObject;
  return datasets;
}
function datasetFor(corpus, searchText, stack, firstYear, lastYear, sensitivity, absolute) {
  let tracks = tracksForWord(corpus, searchText, sensitivity);
  tracks = tracks.filter(function (track) {
    return track.releaseYear >= firstYear
      && track.releaseYear <= lastYear;
  });
  let chartData = createYearAndDepartmentsDataForTracks(
    corpus,
    tracks,
    firstYear,
    lastYear,
    sensitivity,
    absolute
  );
  return {
    label: searchText,
    stack: stack || searchText,
    tracks: tracks,
    data: chartData
  };
}
function tracksForWord(corpus, word, sensitivity = 'case-sensitive') {
  let tracks = [];
  const allTracks = corpus.allTracks();
  if (sensitivity === 'case-sensitive') {
    for (let i = 0; i < allTracks.length; i++) {
      if (allTracks[i].components.indexOf(word) !== -1) {
        tracks.push(new Track(allTracks[i]));
      }
    }
  }
  else if (sensitivity === 'case-insensitive') {
    word = word.toLowerCase();
    for (let i = 0; i < allTracks.length; i++) {
      if (allTracks[i].componentsLowercased.indexOf(word) !== -1) {
        tracks.push(new Track(allTracks[i]));
      }
    }
  }
  return tracks;
}
function createYearAndDepartmentsDataForTracks(corpus, tracks, firstYear, lastYear, sensitivity, absolute) {
  let items = [];
  let yearsToTrackNumbers = corpus.getYearsToTrackNumbers();
  let tracksPerDepartement = corpus.getDepartmentsToTracks();
  let theFirstYear = firstYear || corpus.getEarliestYear();
  let theLastYear = lastYear || corpus.getLatestYear();
  let isAbsolute = absolute === 'absolute';
  for (let index = 0; index < tracks.length; index++) {
    let track = tracks[index];
    let year = track.releaseYear;
    let department = track.departmentNumber;
    let entry = items.find(function (item) {
      return item.location === department && item.date === year;
    });
    if (entry) {
      entry.value += 1;
    } else {
      let departmentEntry = tracksPerDepartement.find(entry => entry.location === department);
      let relative = 1 / yearsToTrackNumbers[year];
      items.push({
        location: department,
        date: year,
        value: 1,
        relativeValue: relative,
        dateTotal: yearsToTrackNumbers[year],
        locationTotal: departmentEntry.value,
      });
    }
    for (let year = theFirstYear; year <= theLastYear; year++) {
      if (items.find(item => item.date === theLastYear)) continue;
      items.push({
        date: year,
        value: 0,
        dateTotal: yearsToTrackNumbers[year]
      });
    }
  }
  if (!isAbsolute) {
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      item.value = item.value / item.dateTotal;
    }
  }
  return items;
}

function tracksForYears(corpus, years) {
}
function yearDepartementTracksRelation(corpus) {
  let relation = {};
  let allTracks = corpus.allTracks();
  allTracks.forEach(function (track) {
    let year = track.releaseYear;
    let departement = track.departmentNumber;
    let yearCandidate = relation[year];
    if (yearCandidate) {
      let departementCandidate = yearCandidate[departement];
      if (departementCandidate) {
        departementCandidate.push(track);
      } else {
        departementCandidate = [track];
      }
      yearCandidate[departement] = departementCandidate;
    } else {
      yearCandidate = {};
      yearCandidate[departement] = [track];
    }
    relation[year] = yearCandidate;
  });
  return relation;
}

function artistsForLocations(corpus, locations) {
  let artists = corpus.artists;
  let includedArtists = [];
  for (let index = 0; index < artists.length; index++) {
    let artist = artists[index];
    if (locations.includes(String(artist.departmentNo))) {
      includedArtists.push(artist);
    }
  }
  return artistsDatasets(includedArtists);
}
function artistsDatasets(artists) {
  let datasets = [];
  for (let index = 0; index < artists.length; index++) {
    let artist = artists[index];
    let tracks = artist.allTracks();
    let data = [];
    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
      let track = tracks[trackIndex];
      data.push({
        date: track.releaseYear,
        location: artist.departmentNo,
        value: 1,
      });
    }
    datasets.push({
      label: artist.name,
      stack: artist.name,
      data: data
    });
  }
  return datasets;
}

class Corpus {
  constructor(parsedCorpus) {
    this.artists = [];
    this.initialize(parsedCorpus);
  }
  initialize(parsedCorpus) {
    console.log(`frc parse corpus`);
    for (let i = 0; i < parsedCorpus.length; i++) {
      const artistJSON = parsedCorpus[i];
      const artist = new Artist(artistJSON);
      this.artists.push(artist);
    }
    console.log(`frc loaded corpus`);
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
  getEarliestYear() {
    let allTracks = this.allTracks();
    let firstYear = allTracks.find(item => item !== undefined).releaseYear;
    return this.allTracks().reduce((current, next) => current < next.releaseYear ? current : next.releaseYear, firstYear);
  }
  getLatestYear() {
    let allTracks = this.allTracks();
    let lastYear = allTracks.find(item => item !== undefined).releaseYear;
    return this.allTracks()
      .reduce((current, next) => current > next.releaseYear ? current : next.releaseYear, lastYear);
  }
  getDateLabels() {
    console.log('this.firstYear', this.firstYear);
    let firstDate = this.firstYear || this.getEarliestYear();
    let lastDate = this.lastYear || this.getLatestYear();
    let range = lastDate - firstDate + 1;
    return Array(range).fill(0).map((e, i) => i + firstDate);
  }
  getYearsToTrackNumbers() {
    return getYearsToCollection(this, () => 1);
  }
  getYearsToWords() {
    return getYearsToCollection(this, (track) => track.components.length);
  }
  getYearsToWordsRelative() {
    return getYearsToCollectionRelative(this, this.getYearsToWords());
  };
  getYearsToTypes() {
    return getYearsToCollection(this, (track) => track.types.length);
  };
  getYearsToTypesRelative() {
    return getYearsToCollectionRelative(this, this.getYearsToTypes());
  };
  getDepartmentsToTracks() {
    return getDepartmentsToCollection(this, () => 1);
  }
  getDepartmentsToWords() {
    return getDepartmentsToCollection(this, (track) => track.components.length);
  }
  getDepartmentsToWordsRelative() {
    return getDepartmentsToCollectionRelative(this, this.getDepartmentsToWords());
  };
  getDepartmentsToTypes() {
    return getDepartmentsToCollection(this, (track) => track.types.length);
  };
  getDepartmentsToTypesRelative() {
    return getDepartmentsToCollectionRelative(this, this.getDepartmentsToTypes());
  };
  getTracksForYears(years) {
    return tracksForYears();
  }
  getTracks(firstYear, lastYear) {
    return this.allTracks().filter(track => track.releaseYear >= firstYear && track.releaseYear <= lastYear);
  }
  getTracksForYearAndDepartement(year, departmentNumber) {
    return this.allTracks().filter(track => track.releaseYear === year && track.departmentNumber === departmentNumber);
  }
  yearDepartementTracksRelation() {
    return yearDepartementTracksRelation(this);
  }
  getArtistsForLocations(locations) {
    return artistsForLocations(this, locations);
  }
  search(searchQuery, firstYear, lastYear, sensitivity, absolute) {
    return internalSearch(this, searchQuery, firstYear, lastYear, sensitivity, absolute);
  }
}

return Corpus;

})));
//# sourceMappingURL=frc.js.map
