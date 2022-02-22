export const SearchType = {
    sensitive: "case-sensitive",
    insensitve: "case-insensitive",
    regex: "regex",
};

export const SearchCountType = {
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

var _emptyData = null;

export function internalSearch(
    corpus,
    query,
    sensitivity,
    searchCount,
    firstYear,
    lastYear
) {
    console.time("search: " + query);

    let tracks = corpus.tracks;
    let artists = corpus.artists;
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
