let trackModal = document.getElementById("frcv-track-modal");
let settingsModal = document.getElementById("frcv-settings-modal");
let innovationListModal = document.getElementById("frcv-innovation-list-modal");

function closeModal(modal) {
  modal.style.display = "none";
}

function showModal(id) {
  let modal = document.getElementById("frcv-" + id + "-modal");
  modal.style.display = "block";
}

trackModal.onclick = function (event) {
  if (event.target === trackModal) closeModal(trackModal);
};

settingsModal.onclick = function (event) {
  if (event.target === settingsModal) closeModal(settingsModal);
};

innovationListModal.onclick = function (event) {
  if (event.target === innovationListModal) closeModal(innovationListModal);
};

function presentTrackPopup(track, label) {
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

  document.getElementById("frcv-track-modal-content").innerHTML = html;

  showModal("track");
}
