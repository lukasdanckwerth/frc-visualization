
export function createDepartementData(collection, locationAccess, locationNameAccess, valueAccess) {
  let departmentDatasets = [];
  collection.forEach(function (item) {
    let location = locationAccess(item);
    let departmentName = locationNameAccess(item);
    let dataset = departmentDatasets.find(dataset => dataset.location === location);
    if (dataset) {
      dataset.value += valueAccess(item);
    } else {
      departmentDatasets.push({
        location: location,
        locationName: departmentName,
        value: valueAccess(item)
      });
    }
  });
  return departmentDatasets;
}

export function getDepartmentsToTracksCollection(tracks, countFunction) {
  return createDepartementData(tracks,
    track => track.departmentNumber,
    track => track.departmentName,
    countFunction);
}

export function getDepartmentsToArtistsCollection(artists, countFunction) {
  return createDepartementData(artists,
    artist => artist.departmentNo,
    artist => artist.departmentName,
    artist => 1);
}
