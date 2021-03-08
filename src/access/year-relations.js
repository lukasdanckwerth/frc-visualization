

/**
 * Return a year to.. collection.
 * @param corpus
 * @param countFunction
 * @returns {{}}
 */
export function getYearsToCollection(corpus, countFunction) {
  let allTracks = corpus.allTracks();
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
}

/**
 * Returns the relative version of the given year to.. collection.
 * @param corpus
 * @param listPerYear
 * @returns {{}}
 */
export function getYearsToCollectionRelative(corpus, listPerYear) {
  let lyricsPerYear = corpus.getYearsToTrackNumbers();
  let yearCollection = {};
  for (const yearKey in lyricsPerYear) {
    if (lyricsPerYear.hasOwnProperty(yearKey)) {
      let lyricsCount = lyricsPerYear[yearKey];
      let wordsCount = listPerYear[yearKey];
      yearCollection[yearKey] = wordsCount / lyricsCount;
    }
  }
  return yearCollection;
}

/**
 *
 * @param corpus
 * @param tracks
 * @returns {[]}
 */
export function createYearDataForTracks(corpus, tracks) {
  let yearToAmount = {};
  let includedYears = [];
  let lyricsPerYear = corpus.getYearsToTrackNumbers();

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
    const yearTotal = lyricsPerYear[year];
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
