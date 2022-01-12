export function parseArtists(json) {
  console.log(`[FRC] Parse artists`);
  let artists = [],
    artist;
  for (let i = 0; i < json.length; i++) {
    artist = json[i];
    Object.assign(artist, {
      allTracks: function () {
        let tracks = this.tracks.map((t) => t);
        this.albums.forEach((album) => tracks.push(...album.tracks));
        return tracks;
      },
      hasTracks: function () {
        return this.allTracks().length > 0;
      },
    });

    artist.departementNo = "" + (artist.departementNo || artist.departementNo);
    artist.departementName = artist.departementName || artist.departement;

    if (artist.hasTracks()) artists.push(artist);
  }
  return artists;
}
