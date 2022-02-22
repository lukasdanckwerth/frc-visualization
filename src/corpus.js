import { parseArtists } from "./parse.artists.js";
import { parseTracks } from "./parse.tacks.js";
import { internalSearch } from "./corpus.search";
import * as d3 from "d3";

function ArraySet(input) {
    return Array.from(new Set(input));
}

export function measure(label, func) {
    label = label || "measure";
    console.time(label);
    func();
    console.timeEnd(label);
}

export class Corpus {
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

        this.datesToTracks = d3.rollup(
            this.tracks,
            (v) => v.length,
            (d) => d.releaseYear
        );

        this.datesToWords = d3.rollup(
            this.tracks,
            (v) => d3.sum(v, (d) => d.tokens.length),
            (d) => d.releaseYear
        );

        this.locationsToTracks = d3.rollup(
            this.tracks,
            (v) => v.length,
            (d) => d.departementNo
        );

        this.locationsToWords = d3.rollup(
            this.tracks,
            (v) => d3.sum(v, (d) => d.tokens.length),
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
