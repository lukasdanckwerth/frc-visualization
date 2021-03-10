import {Popup} from "../../../lotivis/src/js/components/popup";

/**
 *
 * @class TrackPopup
 * @extends Popup
 */
export class TrackPopup extends Popup {

  /**
   *
   */
  render() {
    super.render();
    this.renderHeadline();
    this.renderRow();

    this.renderTrackContentContainer();
  }

  renderHeadline() {
    this.card
      .headerRow
      .append('h3')
      .text(Language.translate('Track'));
  }

  renderRow() {
    this.row = this.card.body
      .append('div')
      .classed('row', true);
  }

  renderTrackContentContainer() {
    this.lyricsContainer = this.row
      .append('div')
      .classed('col-12', true)
      .append('p');
  }

  update() {
    if (!this.track) return;
    let input = this.searchWord;
    // let content = this.track.components.map(function (word) {
    //     if (word.toLowerCase() === input.toLowerCase()) {
    //         return `<b class="important">${word}</b>`
    //     } else {
    //         return word
    //     }
    // }).join(' ');
    let content = String(this.track.content);
    let lines = content.split('\n');
    let html = '';
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let words = line.split(' ');
      for (let j = 0; j < words.length; j++) {
        let word = words[j];
        if (word.toLowerCase() === input.toLowerCase()) {
          html += `<b class="important">${word}</b>`;
        } else if (word.toLowerCase() === `${input},`.toLowerCase()) {
          html += `<b class="important">${word}</b>`;
        } else {
          html += word;
        }
        html += ' ';
      }
      html += '<br>';
    }

    this.lyricsContainer.html(html);
  }

  /**
   *
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {
      width: 800,
      height: 600
    };
  }
}
