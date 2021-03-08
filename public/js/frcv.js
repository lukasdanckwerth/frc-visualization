/*!
 * frcv.js v1.0.12 Lukas Danckwerth
 */
(function (factory) {
typeof define === 'function' && define.amd ? define(factory) :
factory();
}((function () { 'use strict';

class Track {
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
      const track = new Track(trackJSON);
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
  getYearsToTrackNumbers() {
    return this.getYearsToCollection(track => 1);
  }
  getYearsToWords() {
    return this.getYearsToCollection((track) => track.components.length);
  }
  getYearsToWordsRelative() {
    let wordsPerYear = this.getYearsToWords();
    return this.getYearsToCollectionRelative(wordsPerYear);
  };
  getYearsToTypes() {
    return this.getYearsToCollection((track) => track.types.length);
  };
  getYearsToTypesRelative() {
    let typesPerYear = this.getYearsToTypes();
    return this.getYearsToCollectionRelative(typesPerYear);
  };
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
  getDepartmentsToTracks() {
    return this.getDepartmentsToCollection(() => 1);
  }
  getDepartmentsToWords() {
    return this.getDepartmentsToCollection((track) => track.components.length);
  }
  getDepartmentsToWordsRelative() {
    let wordsPerYear = this.getDepartmentsToWords();
    return this.getDepartmentsToCollectionRelative(wordsPerYear);
  };
  getDepartmentsToTypes() {
    return this.getDepartmentsToCollection((track) => track.types.length);
  };
  getDepartmentsToTypesRelative() {
    let typesPerYear = this.getDepartmentsToTypes();
    return this.getDepartmentsToCollectionRelative(typesPerYear);
  };
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
  createYearDataForTracks(tracks) {
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
  createDepartmentDataForTracks(tracks) {
    let locationToAmount = {};
    let departmentNumbers = [];
    this.getDepartmentsToTracks();
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
  search(searchQuery) {
    let groups = searchQuery.split(';').map(value => value.trim());
    groups = groups.map(group => group.split(',').map(word => word.trim()).join(','));
    groups = groups.map(group => group.trim());
    groups.join(';');
    let datasets = [];
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i];
      let words = group.split(',').map(value => value.trim());
      let stack = words.join(", ");
      for (let j = 0; j < words.length; j++) {
        let searchWord = words[j];
        let dataset = this.datasetFor(searchWord, stack);
        console.log(stack);
        datasets.push(dataset);
      }
    }
    return datasets;
  }
  datasetFor(searchText, stack) {
    let sensitivity = 'case-sensitive';
    let firstYear = 1995;
    let lastYear = 2020;
    let tracks = this.tracksForWord(searchText, sensitivity);
    tracks = tracks.filter(function (track) {
      return track.releaseYear >= firstYear
        && track.releaseYear <= lastYear;
    });
    let chartData = this.createYearAndDepartmentsDataForTracks(
      tracks,
      firstYear,
      lastYear,
      sensitivity
    );
    return {
      label: searchText,
      stack: stack || searchText,
      data: chartData
    };
  }
  createYearAndDepartmentsDataForTracks(tracks, firstYear, lastYear, sensitivity) {
    let items = [];
    let yearsToTrackNumbers = this.getYearsToTrackNumbers();
    let tracksPerDepartement = this.getDepartmentsToTracks();
    let theFirstYear = firstYear || this.getEarliestYear();
    let theLastYear = lastYear || this.getLatestYear();
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
    return items;
  }
}

exports.Track = Track;
exports.Album = Album;
exports.Artist = Artist;
exports.Corpus = Corpus;

})));
//# sourceMappingURL=frcv.js.map
