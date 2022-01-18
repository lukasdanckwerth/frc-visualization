import { parseArtists } from "./parse.artists.js";
import { parseTracks } from "./parse.tacks.js";
import { internalSearch } from "./corpus.search";
import * as d3 from "d3";

function ArraySet(input) {
  return Array.from(new Set(input));
}

export class Corpus {
  constructor(json) {
    this.artists = parseArtists(json);
    this.tracks = parseTracks(json);
    console.log(`[FRC] Found ${this.artists.length} artists`);
    console.log(`[FRC] Found ${this.tracks.length} tracks`);

    // let d3 = load_d3();

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
