
/**
 * Returns a departement to.. collection.
 *
 * @param corpus
 * @param countFunction
 * @returns {{}}
 */
export function getDepartmentsToCollection(corpus, countFunction) {
  let departmentDatasets = [];
  let allTracks = corpus.allTracks();
  allTracks.forEach(function (track) {
    let location = track.departmentNumber;
    let departmentName = track.departmentName;
    let dataset = departmentDatasets.find(dataset => dataset.location === location);
    if (dataset) {
      dataset.value += countFunction(track);
    } else {
      departmentDatasets.push({
        location: location,
        locationName: departmentName,
        value: countFunction(track)
      });
    }
  });
  return departmentDatasets;
}

/**
 * Returns the relative version of the given department to.. collection.
 *
 * @param corpus
 * @param listPerDepartement
 * @returns {{}}
 */
export function getDepartmentsToCollectionRelative(corpus, listPerDepartement) {
  let tracksPerDepartment = corpus.getDepartmentsToTracks();
  for (let index = 0; index < listPerDepartement.length; index++) {
    let item = listPerDepartement[index];
    let location = item.location;
    let trackCount = tracksPerDepartment.find(item => item.location === location);
    let itemCount = listPerDepartement.find(item => item.location === location);
    item.value = itemCount.value / trackCount.value;
  }

  return listPerDepartement;
}


/**
 *
 * @param corpus
 * @param tracks
 * @returns {[]}
 */
export function createDepartmentDataForTracks(corpus, tracks) {
  let locationToAmount = {};
  let departmentNumbers = [];
  let tracksPerDepartement = corpus.getDepartmentsToTracks();

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const departmentNumber = track.departmentNumber;

    if (!departmentNumbers.includes(departmentNumber)) {
      departmentNumbers.push(departmentNumber);
    }

    if (locationToAmount[departmentNumber]) {
      locationToAmount[departmentNumber] = locationToAmount[departmentNumber] + 1;
    } else {
      locationToAmount[departmentNumber] = 1;
    }
  }

  departmentNumbers = departmentNumbers.sort();

  let items = [];
  for (let i = 0; i < departmentNumbers.length; i++) {
    const departmentNumber = departmentNumbers[i];
    const value = locationToAmount[departmentNumber] || 0;
    items.push({
      location: departmentNumber,
      value: value,
      relativeLocationValue: value
    });
  }

  return items;
}
