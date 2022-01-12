let background = lotivis.d3.select("#frcv-track-popup-background");
let popup = lotivis.d3.select("#frcv-track-popup");

function hidePopup() {
  background.style("display", "none");
}

function showPopup() {
  background.style("display", "block");
}

function presentTrackPopup(track, label) {
  console.log("track", track);

  showPopup();

  let input = label;
  let lines = track.content.split("\n");
  let html = "";

  html += `<h1 class="frcv-headline">${track.title}</h1>`;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let words = line.split(" ");
    for (let j = 0; j < words.length; j++) {
      let word = words[j];

      if (
        [
          input.toLowerCase(),
          `${input},`.toLowerCase(),
          `${input})`.toLowerCase(),
          `(${input}`.toLowerCase(),
          `${input}]`.toLowerCase(),
          `[${input}`.toLowerCase(),
        ].includes(word.toLowerCase())
      ) {
        html += `<b class="frcv-important">${word}</b>`;
      } else {
        html += word;
      }

      html += " ";
    }
    html += "<br>";
  }

  html += "<br>";
  html += `<a href="${track.url}">${track.url}</a>`;

  popup.html(html);
}

background.on("click", (e, i) => {
  if (e.srcElement.id !== "frcv-track-popup-background") return;
  hidePopup();
});
