
/**
 *
 * @param artists
 * @returns {[]}
 */
export function artistsDatasets(artists) {
  let datasets = [];
  for (let index = 0; index < artists.length; index++) {
    let artist = artists[index];
    let tracks = artist.allTracks();
    let data = [];
    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
      let track = tracks[trackIndex];
      data.push({
        date: track.releaseYear,
        location: artist.departmentNo,
        value: 1,
      })
    }
    datasets.push({
      label: artist.name,
      stack: artist.name,
      data: data
    })
  }
  return datasets;
}
