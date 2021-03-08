import {Album} from "./album";
import {Track} from "./track";

/**
 *
 */
export class Artist {

  constructor(artistJSON) {
    this.name = artistJSON.name;
    this.geniusId = artistJSON.geniusId;
    this.sex = artistJSON.sex;
    this.group = artistJSON.group;
    this.department = artistJSON.department || artistJSON.departement;
    this.departmentNo = artistJSON.departmentNo || artistJSON.departementNo;
    this.departmentName = (artistJSON.department || artistJSON.departement)
      .split("(")[0]
      .trim()
      .toLowerCase();

    this.albums = [];
    for (let i = 0; i < artistJSON.albums.length; i++) {
      const albumJSON = artistJSON.albums[i];
      albumJSON.departmentNo = this.departmentNo;
      albumJSON.departmentName = this.departmentName;
      albumJSON.artistID = artistJSON.geniusId;
      albumJSON.artist = artistJSON.name;
      const album = new Album(albumJSON);
      album.tracks.forEach(track => track.artistID = artistJSON.geniusId);
      album.tracks.forEach(track => track.artist = artistJSON.name);
      this.albums.push(album);
    }

    this.tracks = [];
    for (let i = 0; i < artistJSON.tracks.length; i++) {
      const trackJSON = artistJSON.tracks[i];
      const track = new Track(trackJSON);
      track.departmentNumber = this.departmentNo;
      track.departmentName = this.departmentName;
      track.artistID = artistJSON.geniusId;
      track.artist = artistJSON.name;
      this.tracks.push(track);
    }
  }

  allTracks() {
    let tracks = [];
    for (let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      for (let i = 0; i < album.tracks.length; i++) {
        tracks.push(album.tracks[i]);
      }
    }

    for (let i = 0; i < this.tracks.length; i++) {
      tracks.push(this.tracks[i]);
    }
    return tracks;
  }

  allWords() {
    const allTracks = this.allTracks();
    let allWords = [];
    for (let i = 0; i < allTracks.length; i++) {
      allWords.push(...allTracks[i].components);
    }
    return allWords;
  }
}
