let content = document.getElementById("frcv-track-modal-content");
let modal = document.getElementById("trackModal");
let backdrop = document.getElementById("trackModalBackdrop");

function closeModal() {
  backdrop.style.display = "none";
  modal.style.display = "none";
  modal.classList.remove("show");
}

function showModal() {
  backdrop.style.display = "block";
  modal.style.display = "block";
  modal.classList.add("show");
}

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

function presentTrackPopup(track, label) {
  console.log("track", track);

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

  content.innerHTML = html;

  showModal();
}
