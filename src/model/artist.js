import {Album} from "./album";
import {Track} from "./track";

/**
 *
 */
export class Artist {

  constructor(rawJSON) {
    this.name = rawJSON.name;
    this.geniusId = rawJSON.geniusId;
    this.sex = rawJSON.sex;
    this.group = rawJSON.group;
    this.department = rawJSON.department || rawJSON.departement;
    this.departmentNo = rawJSON.departmentNo || rawJSON.departementNo;
    this.departmentName = (rawJSON.department || rawJSON.departement)
      .split("(")[0]
      .trim()
      .toLowerCase();

    this.albums = [];
    for (let i = 0; i < rawJSON.albums.length; i++) {
      const albumJSON = rawJSON.albums[i];
      albumJSON.departmentNo = this.departmentNo;
      albumJSON.departmentName = this.departmentName;
      albumJSON.artistID = rawJSON.geniusId;
      albumJSON.artist = rawJSON.name;
      const album = new Album(albumJSON);
      album.tracks.forEach(track => track.artistID = rawJSON.geniusId);
      album.tracks.forEach(track => track.artist = rawJSON.name);
      this.albums.push(album);
    }

    this.tracks = [];
    for (let i = 0; i < rawJSON.tracks.length; i++) {
      const trackJSON = rawJSON.tracks[i];
      const track = new Track(trackJSON);
      track.departmentNumber = this.departmentNo;
      track.departmentName = this.departmentName;
      track.artistID = rawJSON.geniusId;
      track.artist = rawJSON.name;
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
