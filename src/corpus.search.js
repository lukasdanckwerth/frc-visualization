export const SearchType = Object.freeze({
    sensitive: "case-sensitive",
    insensitve: "case-insensitive",
    regex: "regex",
});

export const SearchCountType = Object.freeze({
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

var _emptyData = null;

export function internalSearch(
    corpus,
    query,
    searchType,
    searchCountType,
    firstYear,
    lastYear
) {
    console.time("search: " + query);

    let tracks = corpus.tracks;
    let artists = corpus.artists;
    searchType = searchType || SearchType.insensitve;
    searchCountType = searchCountType || SearchCountType.tracks;

    function tracksForWord(word) {
        switch (searchType) {
            case SearchType.sensitive:
                return tracks.filter((t) => t.tokens.indexOf(word) !== -1);
            case SearchType.insensitve:
                let lower = word.toLowerCase();
                return tracks.filter(
                    (t) => t.tokensLower.indexOf(lower) !== -1
                );
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
                        count(t.tokens, word) /
                        corpus.datesToTokens.get(t.releaseYear);
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
        d.data = d.data.filter(
            (d) => d.date >= firstYear && d.date <= lastYear
        );
    });

    console.timeEnd("search: " + query);

    return datasets;
}
