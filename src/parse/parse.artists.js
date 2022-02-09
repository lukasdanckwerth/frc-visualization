/**
 * Returns an array containing all artists who got at least one
 * track from the passed `Corpus.json`.
 *
 * @param {*} json The corpus.json
 * @returns {Array<artist>} An array containing all artists
 */
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
