class TrackPopup extends lotivis.Popup {

  inject() {
    super.inject();
    this.injectTrackContentContainer();
  }

  injectTrackContentContainer() {
    this.lyricsContainer = this.card.body
      .append('div')
      .classed('frcv-lyrics-container', true)
      .classed('frcv-container', true)
      .append('p');
  }

  setTrack(track) {
    this.track = track;
    this.searchWord = track.dataset;
    let artist = this.track.artist;

    let title = this.track.title;
    this.setTitle(`${title} by ${artist} (${this.track.departmentName}, ${this.track.releaseYear})`);

    let content = String(this.track.content);
    this.setContent(content);
  }

  setTitle(newTitle) {
    this.card.titleLabel.text(newTitle || 'Unknown Title');
  }

  setContent(newContent) {
    let input = this.searchWord;
    let lines = newContent.split('\n');
    let html = '';

    html += `<h1 class="frcv-headline">${this.track.title}</h1>`;

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

    html += '<br>';
    html += `<a href="${this.track.url}">${this.track.url}</a>`;

    this.lyricsContainer.html(html);
  }

  preferredSize() {
    return {width: 1000, height: 600};
  }
}
