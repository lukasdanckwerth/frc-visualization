/**
 * Parses a flat version of the given track including information
 * from the passed artist and album (the latter if existing).
 * @param {*} track
 * @param {*} artist
 * @param {*} album
 * @returns
 */
function parseTrack(track, artist, album) {
  if (!track) {
    console.log("track", track);
    console.log("artist", artist);
    console.log("album", album);
    throw Error("no track");
  }
  let content = track.content;
  let tokens = content
    .replace(/,/g, " ")
    .replace(/\./g, " ")
    .replace(/\n/g, " ")
    .replace(/\(/g, " ")
    .replace(/\)/g, " ")
    .replace(/\[/g, " ")
    .replace(/]/g, " ")
    .replace(/\?/g, " ")
    .replace(/\!/g, " ")
    .split(" ")
    .filter((word) => word.length > 0);

  let tokensLower = tokens.map((item) => item.toLowerCase());
  let types = Array.from(new Set(tokens));

  return {
    artist: artist.name,
    artistID: artist.geniusId,
    sex: artist.sex || artist.group,
    album: album,
    departementNo: "" + (artist.departementNo || artist.departementNo),
    departementName: artist.departementName || artist.departement,
    title: track.title,
    fullTitle: track.fullTitle,
    releaseDate: track.releaseDate,
    releaseYear: track.releaseYear,
    id: track.id,
    url: track.url,
    content: content,
    tokens: tokens,
    tokensLower: tokensLower,
    types: types,
  };
}

export function parseTracks(json) {
  console.log(`[FRC] Parse tracks`);
  let data = [],
    ids = [];
  let artist, album, track, entry;
  for (let i = 0; i < json.length; i++) {
    artist = json[i];

    if (!(artist.departementName || artist.departement)) {
      console.log(artist);
      throw Error("missing departement name");
    }

    for (let i = 0; i < artist.albums.length; i++) {
      album = artist.albums[i];
      for (let j = 0; j < album.tracks.length; j++) {
        track = album.tracks[j];
        if (ids.includes(track.id)) continue;
        ids.push(track.id);
        data.push(parseTrack(track, artist, album.name));
      }

      for (let i = 0; i < artist.tracks.length; i++) {
        track = artist.tracks[i];
        if (ids.includes(track.id)) continue;
        ids.push(track.id);
        data.push(parseTrack(track, artist, undefined));
      }
    }
  }

  return data;
}
