import {Track} from "./track";

/**
 *
 */
export class Album {

    constructor(albumJSON) {
        this.name = albumJSON.name;
        this.tracks = [];
        for (let i = 0; i < albumJSON.tracks.length; i++) {
            const trackJSON = albumJSON.tracks[i];
            const track = new Track(trackJSON);
            track.departmentNumber = albumJSON.departmentNo;
            track.departmentName = albumJSON.departmentName;
            track.artistID = albumJSON.geniusId;
            track.artist = albumJSON.name;
            this.tracks.push(track);
        }
    }
}

exports.Album = Album;