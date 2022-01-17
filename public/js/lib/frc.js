/*!
 * frc.js v1.0.50 Lukas Danckwerth
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.frc = {}));
}(this, (function (exports) { 'use strict';

  function parseArtists(json) {
    console.log(`[FRC] Parse artists`);
    let artists = [],
      artist;
    for (let i = 0; i < json.length; i++) {
      artist = json[i];
      Object.assign(artist, {
        allTracks: function () {
          let tracks = this.tracks.map((t) => t);
          this.albums.forEach((album) => tracks.push(...album.tracks));
          return tracks;
        },
        hasTracks: function () {
          return this.allTracks().length > 0;
        },
      });

      artist.departementNo = "" + (artist.departementNo || artist.departementNo);
      artist.departementName = artist.departementName || artist.departement;

      if (artist.hasTracks()) artists.push(artist);
    }
    return artists;
  }

  function parseTracks(json) {
    console.log(`[FRC] Parse tracks`);
    let data = [],
      ids = [];
    let artist, album, track;
    for (let i = 0; i < json.length; i++) {
      artist = json[i];

      if (!(artist.departementName || artist.departement)) {
        console.log(artist);
        throw Error("missing departement name");
      }

      for (let i = 0; i < artist.albums.length; i++) {
        album = artist.albums[i];
        for (let j = 0; j < album.tracks.length; j++) {
          track = album.tracks[j];
          if (ids.includes(track.id)) continue;
          ids.push(track.id);
          data.push(parseTrack(track, artist, album.name));
        }

        for (let i = 0; i < artist.tracks.length; i++) {
          track = artist.tracks[i];
          if (ids.includes(track.id)) continue;
          ids.push(track.id);
          data.push(parseTrack(track, artist, undefined));
        }
      }
    }

    return data;
  }

  function parseTrack(track, artist, album) {
    if (!track) {
      console.log("track", track);
      console.log("artist", artist);
      console.log("album", album);
      throw Error("no track");
    }
    let content = track.content;
    let components = content
      .replace(/,/g, " ")
      .replace(/\./g, " ")
      .replace(/\n/g, " ")
      .replace(/\(/g, " ")
      .replace(/\)/g, " ")
      .replace(/\[/g, " ")
      .replace(/]/g, " ")
      .split(" ")
      .filter((word) => word.length > 0);

    let componentsLowercased = components.map((item) => item.toLowerCase());
    let types = Array.from(new Set(components));

    return {
      artist: artist.name,
      artistID: artist.geniusId,
      album: album,
      departementNo: "" + (artist.departementNo || artist.departementNo),
      departementName: artist.departementName || artist.departement,
      title: track.title,
      fullTitle: track.fullTitle,
      releaseDate: track.releaseDate,
      releaseYear: track.releaseYear,
      id: track.id,
      url: track.url,
      content: content,
      components: components,
      componentsLowercased: componentsLowercased,
      types: types,
    };
  }

  const SEARCH_TYPES = {
    sensitive: "case-sensitive",
    insensitve: "case-insensitive",
    regex: "regex",
  };

  const SEARCH_COUNT = {
    tracks: "tracks",
    tracksRelativeDate: "tracks-relative-date",
    tracksRelativeLocation: "tracks-relative-location",
    words: "words",
    wordsRelativeDate: "words-relative-date",
    wordsRelativeLocation: "words-relative-location",
  };

  function count(array, element) {
    let count = 0;
    for (let i = 0; i < array.length; i++) if (array[i] == element) count++;
    return count;
  }

  function internalSearch(
    corpus,
    query,
    sensitivity,
    searchCount,
    firstYear,
    lastYear
  ) {
    let tracks = corpus.tracks;
    corpus.artists;
    sensitivity = sensitivity || SEARCH_TYPES.insensitve;
    searchCount = searchCount || SEARCH_COUNT.tracks;

    function findTracks(accessor) {
      return tracks.filter(accessor);
    }

    function tracksForWord(word) {
      switch (sensitivity) {
        case SEARCH_TYPES.sensitive:
          return findTracks((t) => t.components.indexOf(word) !== -1);
        case SEARCH_TYPES.insensitve:
          let lower = word.toLowerCase();
          return findTracks((t) => t.componentsLowercased.indexOf(lower) !== -1);
        case SEARCH_TYPES.regex:
          let re = new RegExp(word),
            results;
          return findTracks((t) => {
            results = t.content.match(re);
            return results && results.length > 0;
          });
        default:
          throw new Error("unknown sensitivity: " + sensitivity);
      }
    }

    function data(tracks, label) {
      let data = [],
        value = 0;
      for (let t, candidate, i = 0; i < tracks.length; i++) {
        t = tracks[i];
        if (!t) throw new Error("track invalid: " + i);
        if (!t.departementNo) throw new Error("no departement no: " + i);
        if (!t.releaseYear) throw new Error("no release year: " + i);

        switch (searchCount) {
          case SEARCH_COUNT.tracks:
            value = 1;
            break;
          case SEARCH_COUNT.words:
            value = count(t.components, label);
            break;
          case SEARCH_COUNT.tracksRelativeDate:
            value = 1 / corpus.datesToTracks.get(t.releaseYear);
            break;
          case SEARCH_COUNT.tracksRelativeLocation:
            value = 1 / corpus.locationsToTracks.get(t.departementNo);
            break;
          case SEARCH_COUNT.wordsRelativeDate:
            value =
              count(t.components, label) / corpus.datesToWords.get(t.releaseYear);
            break;
          case SEARCH_COUNT.wordsRelativeLocation:
            value =
              count(t.components, label) /
              corpus.locationsToWords.get(t.departementNo);
            break;
          default:
            throw new Error("unknown search type: " + searchCount);
        }

        candidate = data.find(
          (d) => d.date === t.releaseYear && d.location === t.departementNo
        );

        if (candidate) {
          candidate.value += value;
        } else {
          data.push({
            date: t.releaseYear,
            location: t.departementNo,
            value: value,
          });
        }
      }

      return data;
    }

    function searchStack(stack) {
      let labels = stack.split(",").map((l) => l.trim());
      let datasets = [];

      for (let i = 0; i < labels.length; i++) {
        let label = labels[i];
        let tracks = tracksForWord(label);
        datasets.push({ label, stack, data: data(tracks, label), tracks });
      }

      return datasets;
    }

    let stacks = query.split(";").map((value) => value.trim());
    let datasets = stacks.map((stack) => searchStack(stack)).flat();

    datasets.forEach((d) => {
      d.data = d.data.filter((d) => d.date >= firstYear && d.date <= lastYear);
    });

    return datasets;
  }

  function ArraySet(input) {
    return Array.from(new Set(input));
  }

  function load_d3() {
    return typeof window === "undefined" ? require("d3") : d3 || window.d3;
  }

  class Corpus {
    constructor(json) {
      this.artists = parseArtists(json);
      this.tracks = parseTracks(json);
      console.log(`[FRC] Found ${this.artists.length} artists`);
      console.log(`[FRC] Found ${this.tracks.length} tracks`);

      let d3 = load_d3();

      this.datesToTracks = d3.rollup(
        this.tracks,
        (v) => v.length,
        (d) => d.releaseYear
      );

      this.datesToWords = d3.rollup(
        this.tracks,
        (v) => d3.sum(v, (d) => d.components.length),
        (d) => d.releaseYear
      );

      this.locationsToTracks = d3.rollup(
        this.tracks,
        (v) => v.length,
        (d) => d.departementNo
      );

      this.locationsToWords = d3.rollup(
        this.tracks,
        (v) => d3.sum(v, (d) => d.components.length),
        (d) => d.departementNo
      );
    }

    dates() {
      return Array.from(this.datesToTracks.keys());
    }

    locations() {
      return Array.from(this.locationsToTracks.keys());
    }

    locationNames() {
      return ArraySet(this.artists.map((a) => a.departementName));
    }

    tracksForLocationsAndDates(locations, dates) {
      return this.tracks.filter(
        (t) =>
          locations.includes("" + t.departementNo) &&
          dates.includes(t.releaseYear)
      );
    }

    tracksForLocations(locations) {
      return this.tracks.filter((t) => locations.includes("" + t.departementNo));
    }

    tracksForDates(dates) {
      return this.tracks.filter((t) => dates.includes(t.releaseYear));
    }

    artistsForLocations(locations) {
      return this.artists.filter((a) => locations.includes("" + a.departementNo));
    }

    search(searchQuery, firstYear, lastYear, sensitivity, absolute) {
      return internalSearch(
        this,
        searchQuery,
        sensitivity,
        absolute,
        firstYear,
        lastYear
      );
    }
  }

  function artistsToDatasets(artists) {
    return artists.map((a) => {
      return {
        label: a.name,
        data: a.allTracks().map((t) => {
          return {
            location: a.departementNo,
            date: t.releaseYear,
            value: 1,
          };
        }),
      };
    });
  }

  exports.Corpus = Corpus;
  exports.SEARCH_COUNT = SEARCH_COUNT;
  exports.SEARCH_TYPES = SEARCH_TYPES;
  exports.artistsToDatasets = artistsToDatasets;
  exports.parseArtists = parseArtists;
  exports.parseTracks = parseTracks;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=frc.js.map
