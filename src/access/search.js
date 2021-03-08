import {Track} from "../model/track";

/**
 *
 * @param corpus
 * @param searchQuery
 * @param firstYear
 * @param lastYear
 * @param sensitivity
 * @param absolute
 * @returns {[]}
 */
export function internalSearch(corpus, searchQuery, firstYear, lastYear, sensitivity, absolute) {
  let theFirstYear = firstYear || corpus.getEarliestYear();
  let theLastYear = lastYear || corpus.getLatestYear();
  let theSensitivity = sensitivity || 'case-insensitive';
  let theAbsolute = absolute || 'relative';

  // clean search query
  let groups = searchQuery.split(';').map(value => value.trim());
  groups = groups.map(group => group.split(',').map(word => word.trim()).join(','));
  groups = groups.map(group => group.trim());

  let datasets = [];
  for (let i = 0; i < groups.length; i++) {

    let group = groups[i];
    let words = group.split(',').map(value => value.trim());
    let stack = words.join(", ");

    for (let j = 0; j < words.length; j++) {
      let searchWord = words[j];
      let dataset = datasetFor(
        corpus,
        searchWord,
        stack,
        theFirstYear,
        theLastYear,
        theSensitivity,
        theAbsolute
      );

      datasets.push(dataset);
    }
  }

  return datasets;
}

/**
 *
 * @param corpus
 * @param searchText
 * @param stack
 * @param firstYear
 * @param lastYear
 * @param sensitivity
 * @param absolute
 * @returns {{stack: *, data: *[], label}}
 */
function datasetFor(corpus, searchText, stack, firstYear, lastYear, sensitivity, absolute) {
  let tracks = tracksForWord(corpus, searchText, sensitivity);
  tracks = tracks.filter(function (track) {
    return track.releaseYear >= firstYear
      && track.releaseYear <= lastYear;
  });

  let chartData = createYearAndDepartmentsDataForTracks(
    corpus,
    tracks,
    firstYear,
    lastYear,
    sensitivity
  );

  return {
    label: searchText,
    stack: stack || searchText,
    data: chartData
  };
}

/**
 * Returns an array containing all tracks which contains the given word.
 *
 * @param corpus
 * @param word
 * @param sensitivity
 * @returns {[]}
 */
export function tracksForWord(corpus, word, sensitivity = 'case-sensitive') {
  let tracks = [];
  const allTracks = corpus.allTracks();

  if (sensitivity === 'case-sensitive') {
    for (let i = 0; i < allTracks.length; i++) {
      if (allTracks[i].components.indexOf(word) !== -1) {
        tracks.push(new Track(allTracks[i]));
      }
    }
  }
  else if (sensitivity === 'case-insensitive') {
    word = word.toLowerCase();
    for (let i = 0; i < allTracks.length; i++) {
      if (allTracks[i].componentsLowercased.indexOf(word) !== -1) {
        tracks.push(new Track(allTracks[i]));
      }
    }
  }

  return tracks;
}


/**
 *
 * @param corpus
 * @param tracks
 * @param firstYear
 * @param lastYear
 * @param sensitivity
 * @param absolute
 * @returns {[]}
 */
export function createYearAndDepartmentsDataForTracks(corpus, tracks, firstYear, lastYear, sensitivity, absolute) {
  let items = [];
  let yearsToTrackNumbers = corpus.getYearsToTrackNumbers();
  let tracksPerDepartement = corpus.getDepartmentsToTracks();
  let theFirstYear = firstYear || corpus.getEarliestYear();
  let theLastYear = lastYear || corpus.getLatestYear();

  for (let index = 0; index < tracks.length; index++) {
    let track = tracks[index];
    let year = track.releaseYear;
    let department = track.departmentNumber;

    let entry = items.find(function (item) {
      return item.location === department
        && item.date === year;
    });

    if (entry) {
      entry.value += 1;
    } else {
      let departmentEntry = tracksPerDepartement.find(entry => entry.location === department);
      items.push({
        location: department,
        date: year,
        value: 1,
        dateTotal: yearsToTrackNumbers[year],
        locationTotal: departmentEntry.value,
      });
    }

    for (let year = theFirstYear; year <= theLastYear; year++) {
      if (items.find(item => item.date === theLastYear)) continue;
      items.push({
        date: year,
        value: 0,
        dateTotal: yearsToTrackNumbers[year]
      });
    }
  }

  return items;
}
