export const SEARCH_TYPES = {
  sensitive: "case-sensitive",
  insensitve: "case-insensitive",
  regex: "regex",
};

export const SEARCH_COUNT = {
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

export function internalSearch(
  corpus,
  query,
  sensitivity,
  searchCount,
  firstYear,
  lastYear
) {
  let tracks = corpus.tracks;
  let artists = corpus.artists;
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
      candidate = data.find(
        (d) => d.date === t.releaseYear && d.location === t.departementNo
      );

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
