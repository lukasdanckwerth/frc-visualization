/*!
 * frc-visualization 1.0.74
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

            artist.departementNo =
                "" + (artist.departementNo || artist.departementNo);

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
      let content = track.content;
      let tokens = content
        .replace(/,/g, " ")
        .replace(/\./g, " ")
        .replace(/\n/g, " ")
        .replace(/\(/g, " ")
        .replace(/\)/g, " ")
        .replace(/\[/g, " ")
        .replace(/]/g, " ")
        .replace(/\?/g, " ")
        .replace(/\!/g, " ")
        .split(" ")
        .filter((word) => word.length > 0);

      let tokensLower = tokens.map((item) => item.toLowerCase());
      let types = Array.from(new Set(tokens));

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

    const SearchType = {
        sensitive: "case-sensitive",
        insensitve: "case-insensitive",
        regex: "regex",
    };

    const SearchCountType = {
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
        console.time("search: " + query);

        let tracks = corpus.tracks;
        corpus.artists;
        sensitivity = sensitivity || SearchType.insensitve;
        searchCount = searchCount || SearchCountType.tracks;

        function findTracks(accessor) {
            return tracks.filter(accessor);
        }

        function tracksForWord(word) {
            switch (sensitivity) {
                case SearchType.sensitive:
                    return findTracks((t) => t.tokens.indexOf(word) !== -1);
                case SearchType.insensitve:
                    let lower = word.toLowerCase();
                    return findTracks((t) => t.tokensLower.indexOf(lower) !== -1);
                case SearchType.regex:
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

        function emptyData(label) {
            let dates = corpus.dates();
            let locations = corpus.locations();
            let data = dates.map((date) => {
                return {
                    label,
                    date,
                    location: locations[0],
                    stack: null,
                    value: 0,
                };
            });

            return data.concat(
                locations.map((location) => {
                    return {
                        label,
                        date: firstYear,
                        location: location,
                        stack: null,
                        value: 0,
                    };
                })
            );
        }

        function data(tracks, label) {
            let data = emptyData(label),
                value = 0;
            for (let t, candidate, i = 0; i < tracks.length; i++) {
                t = tracks[i];
                if (!t) throw new Error("track invalid: " + i);
                if (!t.departementNo) throw new Error("no departement no: " + i);
                if (!t.releaseYear) throw new Error("no release year: " + i);

                switch (searchCount) {
                    case SearchCountType.tracks:
                        value = 1;
                        break;
                    case SearchCountType.words:
                        value = count(t.tokens, label);
                        break;
                    case SearchCountType.tracksRelativeDate:
                        value = 1 / corpus.datesToTracks.get(t.releaseYear);
                        break;
                    case SearchCountType.tracksRelativeLocation:
                        value = 1 / corpus.locationsToTracks.get(t.departementNo);
                        break;
                    case SearchCountType.wordsRelativeDate:
                        value =
                            count(t.tokens, label) /
                            corpus.datesToWords.get(t.releaseYear);
                        break;
                    case SearchCountType.wordsRelativeLocation:
                        value =
                            count(t.tokens, label) /
                            corpus.locationsToWords.get(t.departementNo);
                        break;
                    default:
                        throw new Error("unknown search type: " + searchCount);
                }

                candidate = data.find(
                    (d) =>
                        d.date === t.releaseYear && d.location === t.departementNo
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

            let stackFormatted =
                labels.length < 2
                    ? labels[0]
                    : labels[0] + " (+" + (labels.length - 1) + ")";

            for (let i = 0; i < labels.length; i++) {
                let label = labels[i];
                let tracks = tracksForWord(label);
                datasets.push({
                    label,
                    stack: stackFormatted,
                    data: data(tracks, label),
                    tracks,
                });
            }

            return datasets;
        }

        let stacks = query.split(";").map((value) => value.trim());
        let datasets = stacks.map((stack) => searchStack(stack)).flat();

        datasets.forEach((d) => {
            d.data = d.data.filter(
                (d) => d.date >= firstYear && d.date <= lastYear
            );
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
        value = _intern.get(value);
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

    var noop = {value: () => {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    dispatch("start", "end", "cancel", "interrupt");

    function ArraySet(input) {
        return Array.from(new Set(input));
    }

    function measure(label, func) {
        label = label || "measure";
        console.time(label);
        func();
        console.timeEnd(label);
    }

    class Corpus {
        constructor(json) {
            console.time("parse artists");

            let that = this;

            measure("parseArtists", function () {
                that.artists = parseArtists(json);
            });

            measure("parseTracks", function () {
                that.tracks = parseTracks(json);
            });

            console.log(`[FRC] Found ${this.artists.length} artists`);
            console.log(`[FRC] Found ${this.tracks.length} tracks`);

            // let d3 = load_d3();

            console.time("rollup");

            this.datesToTracks = rollup(
                this.tracks,
                (v) => v.length,
                (d) => d.releaseYear
            );

            this.datesToWords = rollup(
                this.tracks,
                (v) => sum(v, (d) => d.tokens.length),
                (d) => d.releaseYear
            );

            this.locationsToTracks = rollup(
                this.tracks,
                (v) => v.length,
                (d) => d.departementNo
            );

            this.locationsToWords = rollup(
                this.tracks,
                (v) => sum(v, (d) => d.tokens.length),
                (d) => d.departementNo
            );

            console.timeEnd("rollup");
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

        tracksForLocations(ls) {
            return this.tracks.filter((t) => ls.includes("" + t.departementNo));
        }

        tracksForDates(dates) {
            return this.tracks.filter((t) => dates.includes(t.releaseYear));
        }

        artistsForLocations(ls) {
            return this.artists.filter((a) => ls.includes("" + a.departementNo));
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

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=frc.js.map
