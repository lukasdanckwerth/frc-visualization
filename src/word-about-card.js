import {Card} from "../../lotivis/src/js/components/card";
import {TrackPopup} from "./track-popup";

/**
 *
 * @class WordAboutCard
 * @extends Card
 */
export class WordAboutCard extends Card {

  /**
   * Creates a new instance of WordAboutCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
  }

  update() {
    this.body.html('');
    if (!this.datasets) return;

    this.divs = this.body
      .selectAll('div')
      .data(this.datasets)
      .enter()
      .append('div')
      .html(function (dataset, index) {
        let components = [];
        if (index !== 0) {
          components.push(`<br>`);
        }
        components.push(`<b class="larger">`);
        components.push(`${dataset.label}`);
        components.push(` (${dataset.data.length} Tracks)`);
        components.push(`</b>`);
        return components.join('');
      })
      .selectAll("div")
      .data(function (dataset) {
        dataset.data.forEach(item => item.dataset = dataset.label);
        return dataset.data
          .sort(function (item1, item2) {
            return d3.descending(item1.releaseYear, item2.releaseYear);
          });
      })
      .enter()
      .append("div")
      .style('cursor', 'pointer')
      .html(function (item) {
        let components = [];
        components.push(`<span class="primary">${item.title}</span>`);
        components.push(`<span class="secondary">(by ${item.artist}, ${item.releaseYear})</span>`);
        return `<li>${components.join(' ')}</li>`;
      })
      .on('click', function (event, item) {
        let parent = window.frcvApp.element;
        let popup = new TrackPopup(parent);

        console.log(item);
        popup.searchWord = item.dataset;
        popup.track = item;
        popup.update();
        popup.showBigModal();

      });
  }
}
