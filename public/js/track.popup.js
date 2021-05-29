class TrackPopup extends lotivis.Popup {

  inject() {
    super.inject();
    this.injectTrackContentContainer();
  }

  injectTrackContentContainer() {
    this.lyricsContainer = this.card.body
      .append('div')
      .classed('frcv-lyrics-container', true)
      .append('p');
  }

  setTitle(newTitle) {
    this.card.titleLabel.text(newTitle || 'Unknown Title');
  }

  setContent(newContent) {
    let input = this.searchWord;
    let lines = newContent.split('\n');
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
        } else if (word.toLowerCase() === `${input})`.toLowerCase()) {
          html += `<b class="important">${word}</b>`;
        } else if (word.toLowerCase() === `(${input}`.toLowerCase()) {
          html += `<b class="important">${word}</b>`;
        } else {
          html += word;
        }
        html += ' ';
      }
      html += '<br>';
    }

    this.lyricsContainer.html(html);
    console.log(this.track);
  }

  update() {
    if (!this.track) return;

    let artist = this.track.artist;
    let title = this.track.title;
    this.setTitle(`${artist} - ${title}`);

    let content = String(this.track.content);
    this.setContent(content);
  }

  preferredSize() {
    return {
      width: 1000,
      height: 600
    };
  }
}
