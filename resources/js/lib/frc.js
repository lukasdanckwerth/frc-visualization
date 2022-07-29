/*!
 * frc-visualization 1.0.78
 * Copyright (c) 2022 Lukas Danckwerth
 * Released under MIT License
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.frc = {}));
})(this, (function (exports) { 'use strict';

  /**
   * Returns an array containing all artists who got at least one
   * track from the passed `Corpus.json`.
   *
   * @param {*} json The corpus.json
   * @returns {Array<artist>} An array containing all artists
   */
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

  /**
   * Parses a flat version of the given track including information
   * from the passed artist and album (the latter if existing).
   * @param {*} track
   * @param {*} artist
   * @param {*} album
   * @returns
   */
  function parseTrack(track, artist, album) {
    if (!track) {
      console.log("track", track);
      console.log("artist", artist);
      console.log("album", album);
      throw Error("no track");
    }
    let content = track.content,
      tokens = content
        .replace(/,/g, " ")
        .replace(/\./g, " ")
        .replace(/\n/g, " ")
        .replace(/\(/g, " ")
        .replace(/\)/g, " ")
        .replace(/\[/g, " ")
        .replace(/]/g, " ")
        .replace(/\?/g, " ")
        .replace(/\!/g, " ")
        .replace(/\bs'/gi, "")
        .replace(/\bm'/gi, "")
        .replace(/\bt'/gi, "")
        .replace(/\bd'/gi, "")
        .replace(/\bj'/gi, "")
        .replace(/\br'/gi, "")
        .replace(/\bl'/gi, "")
        .replace(/\bn'/gi, "")
        .split(" ")
        .filter((word) => word.length > 0),
      tokensLower = tokens.map((item) => item.toLowerCase()),
      types = Array.from(new Set(tokens));

    return {
      artist: artist.name,
      artistID: artist.geniusId,
      sex: artist.sex || artist.group,
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
      tokens: tokens,
      tokensLower: tokensLower,
      types: types,
    };
  }

  function parseTracks(json) {
    console.log(`[FRC] Parse tracks`);
    let data = [],
      ids = [],
      artist,
      album,
      track;

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
          // if (ids.includes(track.id)) continue;
          ids.push(track.id);
          data.push(parseTrack(track, artist, album.name));
        }
      }

      for (let i = 0; i < artist.tracks.length; i++) {
        track = artist.tracks[i];
        // if (ids.includes(track.id)) continue;
        ids.push(track.id);
        data.push(parseTrack(track, artist, undefined));
      }
    }

    return data;
  }

  const SearchType = Object.freeze({
    sensitive: "case-sensitive",
    insensitive: "case-insensitive",
    regex: "regex",
  });

  const SearchCountType = Object.freeze({
    tracks: "tracks",
    tracksRelativeDate: "tracks-relative-date",
    tracksRelativeLocation: "tracks-relative-location",
    words: "words",
    wordsRelativeDate: "words-relative-date",
    wordsRelativeLocation: "words-relative-location",
  });

  function count(array, element) {
    let count = 0;
    for (let i = 0; i < array.length; i++) if (array[i] == element) count++;
    return count;
  }

  function internalSearch(
    corpus,
    query,
    searchType,
    searchCountType,
    firstYear,
    lastYear
  ) {
    console.time("search: " + query);

    let tracks = corpus.tracks;
    corpus.artists;
    sensitivity = sensitivity || SearchType.insensitive;
    searchType = searchType || SearchCountType.tracks;

    function findTracks(accessor) {
      return tracks.filter(accessor);
    }

    function tracksForWord(word) {
      switch (searchType) {
        case SearchType.sensitive:
          return findTracks((t) => t.tokens.indexOf(word) !== -1);
        case SearchType.insensitive:
          let lower = word.toLowerCase();
          return tracks.filter((t) => t.tokensLower.indexOf(lower) !== -1);
        case SearchType.regex:
          let re = new RegExp(word),
            results;
          return tracks.filter((t) => {
            results = t.content.match(re);
            return results && results.length > 0;
          });
        default:
          throw new Error("unknown search count type: " + searchType);
      }
    }

    function emptyData(word) {
      let dates = corpus.dates();
      let locations = corpus.locations();
      let data = dates.map((date) => {
        return {
          label: word,
          date: date,
          location: locations[0],
          group: null,
          value: 0,
        };
      });

      return data.concat(
        locations.map((location) => {
          return {
            labeL: word,
            date: firstYear,
            location: location,
            group: null,
            value: 0,
          };
        })
      );
    }

    function data(tracks, word) {
      let data = emptyData(word),
        value = 0;
      for (let t, candidate, i = 0; i < tracks.length; i++) {
        t = tracks[i];
        if (!t) throw new Error("track invalid: " + i);
        if (!t.departementNo) throw new Error("no departement no: " + i);
        if (!t.releaseYear) throw new Error("no release year: " + i);

        switch (searchCountType) {
          case SearchCountType.tracks:
            value = 1;
            break;
          case SearchCountType.words:
            value = count(t.tokens, word);
            break;
          case SearchCountType.tracksRelativeDate:
            value = 1 / corpus.datesToTracks.get(t.releaseYear);
            break;
          case SearchCountType.tracksRelativeLocation:
            value = 1 / corpus.locationsToTracks.get(t.departementNo);
            break;
          case SearchCountType.wordsRelativeDate:
            value =
              count(t.tokens, word) / corpus.datesToTokens.get(t.releaseYear);
            break;
          case SearchCountType.wordsRelativeLocation:
            value =
              count(t.tokens, word) /
              corpus.locationsToTokens.get(t.departementNo);
            break;
          default:
            throw new Error("unknown search type: " + searchCountType);
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

    function searchGroup(group) {
      if (searchType == SearchType.regex) {
        let word = group;
        let tracks = tracksForWord(word);
        return {
          label: word,
          group: word,
          data: data(tracks, word),
          tracks,
        };
      } else {
        let words = group.split(",").map((l) => l.trim()),
          datasets = [],
          groupFormatted =
            words.length < 2
              ? words[0]
              : words[0] + " (+" + (words.length - 1) + ")";

        for (let i = 0; i < words.length; i++) {
          let word = words[i],
            tracks = tracksForWord(word);
          datasets.push({
            label: word,
            group: groupFormatted,
            data: data(tracks, word),
            tracks,
          });
        }

        return datasets;
      }
    }

    let groups = [];
    if (searchType == SearchType.regex) {
      groups = [query.trim()];
    } else {
      groups = query.split(";").map((value) => value.trim());
    }

    let datasets = groups.map((group) => searchGroup(group)).flat();

    datasets.forEach((d) => {
      d.data = d.data.filter((d) => d.date >= firstYear && d.date <= lastYear);
    });

    console.timeEnd("search: " + query);

    return datasets;
  }

  class InternMap extends Map {
    constructor(entries, key = keyof) {
      super();
      Object.defineProperties(this, {_intern: {value: new Map()}, _key: {value: key}});
      if (entries != null) for (const [key, value] of entries) this.set(key, value);
    }
    get(key) {
      return super.get(intern_get(this, key));
    }
    has(key) {
      return super.has(intern_get(this, key));
    }
    set(key, value) {
      return super.set(intern_set(this, key), value);
    }
    delete(key) {
      return super.delete(intern_delete(this, key));
    }
  }

  function intern_get({_intern, _key}, value) {
    const key = _key(value);
    return _intern.has(key) ? _intern.get(key) : value;
  }

  function intern_set({_intern, _key}, value) {
    const key = _key(value);
    if (_intern.has(key)) return _intern.get(key);
    _intern.set(key, value);
    return value;
  }

  function intern_delete({_intern, _key}, value) {
    const key = _key(value);
    if (_intern.has(key)) {
      value = _intern.get(key);
      _intern.delete(key);
    }
    return value;
  }

  function keyof(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }

  function identity(x) {
    return x;
  }

  function rollup(values, reduce, ...keys) {
    return nest(values, identity, reduce, keys);
  }

  function nest(values, map, reduce, keys) {
    return (function regroup(values, i) {
      if (i >= keys.length) return reduce(values);
      const groups = new InternMap();
      const keyof = keys[i++];
      let index = -1;
      for (const value of values) {
        const key = keyof(value, ++index, values);
        const group = groups.get(key);
        if (group) group.push(value);
        else groups.set(key, [value]);
      }
      for (const [key, values] of groups) {
        groups.set(key, regroup(values, i));
      }
      return map(groups);
    })(values, 0);
  }

  function sum(values, valueof) {
    let sum = 0;
    if (valueof === undefined) {
      for (let value of values) {
        if (value = +value) {
          sum += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if (value = +valueof(value, ++index, values)) {
          sum += value;
        }
      }
    }
    return sum;
  }

  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }

  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };

  new Transform(1, 0, 0);

  Transform.prototype;

  class Corpus {
    constructor(json) {
      this.artists = parseArtists(json);
      this.tracks = parseTracks(json);

      console.log(`[FRC] Found ${this.artists.length} artists`);
      console.log(`[FRC] Found ${this.tracks.length} tracks`);

      this.datesToTracks = rollup(
        this.tracks,
        (v) => v.length,
        (d) => d.releaseYear
      );

      this.datesToTokens = rollup(
        this.tracks,
        (v) => sum(v, (d) => d.tokens.length),
        (d) => d.releaseYear
      );

      this.locationsToTracks = rollup(
        this.tracks,
        (v) => v.length,
        (d) => d.departementNo
      );

      this.locationsToTokens = rollup(
        this.tracks,
        (v) => sum(v, (d) => d.tokens.length),
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
      return Array.from(new Set(this.artists.map((a) => a.departementName)));
    }

    tracksForLocationsAndDates(locations, dates) {
      return this.tracks.filter(
        (t) =>
          locations.includes("" + t.departementNo) &&
          dates.includes(t.releaseYear)
      );
    }

    tracksForLocations(ls) {
      return this.tracks.filter((t) => ls.includes("" + t.departementNo));
    }

    tracksForDates(dates) {
      return this.tracks.filter((t) => dates.includes(t.releaseYear));
    }

    artistsForLocations(ls) {
      return this.artists.filter((a) => ls.includes("" + a.departementNo));
    }

    search(query, firstYear, lastYear, searchType, searchCountType) {
      return internalSearch(
        this,
        query,
        searchType,
        searchCountType,
        firstYear,
        lastYear
      );
    }
  }

  function fetchCorpus(progress, url) {
    return new Promise(function (resolve, reject) {
      if (typeof progress !== "function") progress = function () {};

      let xhr = new XMLHttpRequest();
      xhr.open("GET", url || "./assets/corpus.json");

      xhr.onprogress = function (event) {
        progress(event.loaded, event.total);
      };

      xhr.onload = function (event) {
        progress(event.total, event.total);

        if (xhr.status != 200) {
          reject(`Error ${xhr.status}: ${xhr.statusText}`);
        } else {
          resolve(new Corpus(JSON.parse(xhr.response)));
        }
      };

      xhr.send();
    });
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
  exports.SearchCountType = SearchCountType;
  exports.SearchType = SearchType;
  exports.artistsToDatasets = artistsToDatasets;
  exports.fetchCorpus = fetchCorpus;
  exports.parseArtists = parseArtists;
  exports.parseTracks = parseTracks;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=frc.js.map
