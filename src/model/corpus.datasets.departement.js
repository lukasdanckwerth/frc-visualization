export function createDepartementData(tracksPerDepartement, collection, locationAccess, locationNameAccess, valueAccess) {
  let departmentDatasets = [];

  for (let i = 0; i < collection.length; i++) {
    let item = collection[i];
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
  }

  if (tracksPerDepartement) {
    for (let departementIndex = 0; departementIndex < tracksPerDepartement.length; departementIndex++) {
      let departmentObject = tracksPerDepartement[departementIndex];
      let location = departmentObject.location;
      if (departmentDatasets.find(item => item.location === location)) continue;
      departmentDatasets.push({
        value: 0,
        location: location,
        locationTotal: departmentObject.value,
      });
    }
  }

  return departmentDatasets;
}

export function getDepartmentsToTracksCollection(tracksPerDepartement, tracks, countFunction) {
  return createDepartementData(
    tracksPerDepartement,
    tracks,
    track => track.departmentNumber,
    track => track.departmentName,
    countFunction);
}

export function getDepartmentsToTracksCollectionRelative(data, tracksPerDepartement) {
  data.forEach(function (item) {
    let itemLocation = item.location;
    let tracksPerDepartementItem = tracksPerDepartement.find(item => item.location === itemLocation);
    if (!tracksPerDepartementItem) return;
    item.value = item.value / tracksPerDepartementItem.value;
  });
  return data;
}

export function getDepartmentsToArtistsCollection(tracksPerDepartement, artists, countFunction) {
  return createDepartementData(
    tracksPerDepartement,
    artists,
    artist => artist.departmentNo,
    artist => artist.departmentName,
    artist => 1
  );
}
