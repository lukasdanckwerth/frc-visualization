/**
 *
 * @class Track
 */
export class Track {

  /**
   *
   * @param trackJSON
   */
  constructor(trackJSON) {

    this.title = trackJSON.title;
    this.fullTitle = trackJSON.fullTitle;
    this.releaseDate = trackJSON.releaseDate;
    this.releaseYear = trackJSON.releaseYear;
    this.departmentNumber = trackJSON.departmentNumber;
    this.departmentName = trackJSON.departmentName;
    this.id = trackJSON.id;
    this.url = trackJSON.url;
    this.artistID = trackJSON.artistID;
    this.artist = trackJSON.artist;
    this.content = trackJSON.content;

    if (trackJSON.content) {
      this.components = trackJSON.content
        .replace(/,/g, ' ')
        .replace(/\./g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\(/g, ' ')
        .replace(/\)/g, ' ')
        .replace(/\[/g, ' ')
        .replace(/]/g, ' ')
        .split(" ")
        .filter((word) => word.length > 0);
    } else if (trackJSON.components) {
      this.components = trackJSON.components;
    }

    this.componentsLowercased = this.components.map(item => item.toLowerCase());

    let typesSet = new Set(this.components);
    this.types = Array.from(typesSet);
  }
}
