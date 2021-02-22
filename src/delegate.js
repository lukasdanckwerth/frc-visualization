import {Corpus} from './corpus';
import {Artist} from "./artist";
import {Album} from "./album";
import {Track} from "./track";

/**
 *
 * @class FRCDelegate
 */
export class FRCDelegate {

  /**
   * Creates a new instance of FRCDelegate.
   */
  constructor() {

    this.name = 'French Rap Corpus Visualization';
    this.geoJSON = 'assets/Departements-Simple.geojson';
    this.dataJSON = 'assets/Corpus-Light.json';

    let delegate = this;
    this.loadData = function (progressFunction) {

      return new Promise(function (resolve, reject) {

        let req = new XMLHttpRequest();

        req.addEventListener("progress", function (event) {
          if (event.lengthComputable) {
            let percentComplete = event.loaded / event.total;
            progressFunction(percentComplete, null);
          } else {
            let message = 'Unable to compute progress information since the total size is unknown';
            progressFunction(null, message);
          }
        }, false);

        // load responseText into a new script element
        req.addEventListener("load", function (event) {

          let rawJSON = event.target.responseText;
          delegate.rawJSON = rawJSON;

          let corpusJSON = JSON.parse(rawJSON);
          let corpus = new Corpus(corpusJSON);
          delegate.corpus = corpus;

          resolve(corpus);

        }, false);

        req.open("GET", delegate.dataJSON);
        req.send();
      })
    }.bind(this);
  }
}

exports.Corpus = Corpus;
exports.Artist = Artist;
exports.Album = Album;
exports.Track = Track;
