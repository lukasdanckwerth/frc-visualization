/**
 *
 * @class FRCDelegate
 */
class FRCDelegate {

  /**
   * Creates a new instance of FRCDelegate.
   */
  constructor() {

    this.name = 'French Rap Corpus Visualization';
    this.geoJSON = 'assets/Departements-Simple.geojson';
    this.dataJSON = 'assets/Corpus-Original.json';

    let delegate = this;
    this.loadData = function (progressFunction, completion) {

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
        delegate.corpus = new Corpus(corpusJSON);

        completion();

      }, false);

      req.open("GET", this.dataJSON);
      req.send();

    }.bind(this);
  }
}
