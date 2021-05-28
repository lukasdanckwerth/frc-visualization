export function tracksForYears(corpus, years) {

}

export function yearDepartementTracksRelation(corpus) {
  let relation = {};
  let allTracks = corpus.allTracks();
  allTracks.forEach(function (track) {
    let year = track.releaseYear;
    let departement = track.departmentNumber;
    let yearCandidate = relation[year];

    if (yearCandidate) {
      let departementCandidate = yearCandidate[departement];
      if (departementCandidate) {
        departementCandidate.push(track);
      } else {
        departementCandidate = [track];
      }
      yearCandidate[departement] = departementCandidate;
    } else {
      yearCandidate = {};
      yearCandidate[departement] = [track];
    }

    relation[year] = yearCandidate;
  });

  return relation;
}
