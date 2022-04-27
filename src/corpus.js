import { parseArtists } from "./parse.artists.js";
import { parseTracks } from "./parse.tacks.js";
import { internalSearch } from "./corpus.search";
import * as d3 from "d3";

export class Corpus {
    constructor(json) {
        this.artists = parseArtists(json);
        this.tracks = parseTracks(json);

        console.log(`[FRC] Found ${this.artists.length} artists`);
        console.log(`[FRC] Found ${this.tracks.length} tracks`);

        this.datesToTracks = d3.rollup(
            this.tracks,
            (v) => v.length,
            (d) => d.releaseYear
        );

        this.datesToTokens = d3.rollup(
            this.tracks,
            (v) => d3.sum(v, (d) => d.tokens.length),
            (d) => d.releaseYear
        );

        this.locationsToTracks = d3.rollup(
            this.tracks,
            (v) => v.length,
            (d) => d.departementNo
        );

        this.locationsToTokens = d3.rollup(
            this.tracks,
            (v) => d3.sum(v, (d) => d.tokens.length),
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
