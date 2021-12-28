export function createYearData(collection, dateAccess, valueAccess) {
  let data = [];
  collection.forEach(function (item) {
    let date = dateAccess(item);
    let dataset = data.find(dataset => dataset.date === date);
    if (dataset) {
      dataset.value += valueAccess(item);
    } else {
      data.push({
        date: date,
        value: valueAccess(item)
      });
    }
  });
  return data;
}

/**
 * Return a year to.. collection.
 * @param tracks
 * @param countFunction
 * @returns {{}}
 */
export function getYearsToTracksCollection(tracks, countFunction) {
  return createYearData(
    tracks,
    track => track.releaseYear,
    countFunction);
}

export function getYearsToCollectionRelative(data, tracksPerYear) {
  data.forEach(function (item) {
    let itemDate = item.date;
    let tracksPerYearItem = tracksPerYear.find(item => item.date === itemDate);
    if (!tracksPerYearItem) return;
    item.value = item.value / tracksPerYearItem.value
  })
  return data;
}
