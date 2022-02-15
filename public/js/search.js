// configure lotivis
lotivis.debug(true);
lotivis.config({ downloadFilePrefix: "frcv" });

let d3 = lotivis.d3;

let colorScale =
  urlparams.get("map-color-scale") === "scale2"
    ? lotivis.colorScale2
    : lotivis.colorScale1;

// create lotivis components
let barChart = lotivis
  .bar()
  .selector("#bar-chart")
  .title(null)
  .radius(0)
  .width(800)
  .height(300)
  .marginTop(40)
  .marginLeft(40)
  .labels(true);

let legend = barChart
  .legend()
  .title(null)
  .group(true)
  .groupFormat(function (s, v, ls, i) {
    // return `${i + 1}) ${ls[0]} (+ ${ls.length - 1}) (Sum: ${v})`;
    return `${i + 1}) ${s} (Sum: ${v})`;
  });

let plotChart = lotivis
  .plot()
  .selector("#plot-chart")
  .width(800)
  .marginLeft(0)
  .marginRight(80)
  .barHeight(24)
  .style("fraction")
  .colorMode("single")
  .labels(true);

let mapChart = lotivis
  .map()
  .selector("#map-chart")
  .width(800)
  .height(800)
  .labels(true)
  .legend(true)
  .colorScale(colorScale)
  .labelsExclude(["75", "92", "93", "94"])
  .exclude(["2A", "2B"])
  .featureIDAccessor((f) => f.properties.code)
  .featureNameAccessor((f) => f.properties.nom);

let mapChartParis = lotivis
  .map()
  .selector("#map-chart-paris")
  .width(280)
  .height(280)
  .labels(true)
  .legend(false)
  .colorScale(colorScale)
  .legendPanel(false)
  .include(["75", "92", "93", "94"])
  .featureIDAccessor((f) => f.properties.code)
  .featureNameAccessor((f) => f.properties.nom);

// ##################################################################################
//
//
// ##################################################################################

function getElement(id) {
  return document.getElementById(id);
}

let contentContainer = getElement("content"),
  loadingView = getElement("loading-indicator"),
  searchArea = getElement("frcv-search-field-area"),
  searchField = getElement("search-input");

let corpus = new frc.Corpus("");
let queryParameter = "q";
// let parameters = lotivis.UrlParameters.getInstance();
let recentSearches = new recentsearches("frcv-search-input-data");

// search options;
// let firstYear = 2000;
let firstYear = 1995;
let lastYear = 2020;
let sensitivity = document.getElementById("case-sensitivity").value;
let countType = frc.SearchCountType.tracks;

let byId = (id) => document.getElementById(id);
let trackModal = byId("frcv-track-modal");
let settingsModal = byId("frcv-settings-modal");
let innovationListModal = byId("frcv-innovation-list-modal");
let reacentSearchesModal = byId("frcv-recent-searches-modal");

function closeModal(modal) {
  modal.style.display = "none";
}

function showModal(id) {
  let modal = byId("frcv-" + id + "-modal");
  modal.style.display = "block";
}

contentContainer.style.display = "none";

function onLabelsBar() {
  barChart.config.labels = getElement("labelsBar").checked;
}

function onLabelsMap() {
  mapChart.config.labels = getElement("labelsMap").checked;
}

function onLabelsPlot() {
  plotChart.config.labels = getElement("labelsPlot").checked;
}

function mapColorScaleChange() {
  let value = getElement("map-color-scale").value;
  let scale = value === "scale1" ? lotivis.colorScale1 : lotivis.colorScale2;
  urlparams.set("map-color-scale", value);
  mapChart.colorScale(scale).run();
  mapChartParis.colorScale(scale).run();
}

function onShowData(checkbox) {
  getElement("ltv-data").style.display = checkbox.checked ? "block" : "none";
}

/* search */
function textAreaKeydown(input) {
  if (Object.getPrototypeOf(this.event) !== KeyboardEvent.prototype) return;
  if (this.event.key !== "Enter") return;

  this.event.preventDefault();
  search(input.value);
}

function searchFieldAction(input) {
  if (Object.getPrototypeOf(this.event) !== KeyboardEvent.prototype) return;
  if (this.event.key !== "Enter") return;
  search(input.value);
}

function search(searchText) {
  if (searchText === undefined) {
    return console.log("search text undefined");
  } else if (searchText.trim().length === 0) {
    return console.log("search text too short");
  }

  urlparams.set(queryParameter, searchText.replace(/,/g, "_"));

  let datasets = corpus.search(
    searchText,
    firstYear,
    lastYear,
    sensitivity,
    countType
  );

  let dc = new lotivis.parseDatasets(datasets);
  barChart.run(dc);
  mapChart.run(dc);
  mapChartParis.run(dc);
  plotChart.run(dc);

  fillTracksCard(datasets);
  recentSearches.add(searchText);
  fillRecentSearchesPanel();
}

/* date range */
function updateYearsRange() {
  let dates = d3.range(firstYear, lastYear + 1);
  barChart.dates(dates);
  plotChart.dates(dates);
}

function fromDropdownAction(some) {
  firstYear = Number(some.value);
  updateYearsRange();
  search(searchField.value);
}

function tillDropdownAction(some) {
  lastYear = Number(some.value);
  updateYearsRange();
  search(searchField.value);
}

function fillYearDropdowns() {
  let html = "";
  let firstYearOverride = 2000;

  for (let year = 1995; year < 2021; year++) {
    html += `<option value="${year}">${year}</option>`;
  }

  let fromDropdown = document.getElementById("from-dropdown");
  let tillDropdown = document.getElementById("till-dropdown");
  fromDropdown.innerHTML = html;
  tillDropdown.innerHTML = html;
  tillDropdown.value = `${lastYear}`;

  if (firstYearOverride) {
    firstYear = firstYearOverride;
    fromDropdown.value = `${firstYearOverride}`;
  }
}

function sensitivityDropdownAction(some) {
  sensitivity = some.value;
  search(searchField.value);
}

function countTypeAction(some) {
  (countType = some.value), search(searchField.value);
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

reacentSearchesModal.onclick = function (event) {
  if (event.target === reacentSearchesModal) closeModal(reacentSearchesModal);
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

  byId("frcv-track-modal-content").innerHTML = html;

  showModal("track");
}

d3.json("./assets/departements.geojson").then((geoJSON) => {
  mapChart.geoJSON(geoJSON);
  mapChartParis.geoJSON(geoJSON);
});

d3.json("./assets/corpus.json")
  .then((corpusJSON) => {
    loadingView.innerHTML = `Parsing...`;
    return corpusJSON;
  })
  .then((corpusJSON) => {
    corpus = new frc.Corpus(corpusJSON);

    fillYearDropdowns();
    updateYearsRange();

    loadingView.style.display = "none";
    contentContainer.style.display = "block";
  })
  .then(() => {
    let searchString = urlparams.get(queryParameter);
    if (!searchString) return;
    searchString = searchString.replace(/_/g, ",");
    search(searchString);
    searchField.value = searchString;
    return;
  })
  .catch((error) => console.error(error));

d3.text("./assets/innovation.list.txt").then((text) => {
  let lines = text.split("\n").filter((line) => line.length > 0);
  d3.select("#innovation-list")
    .selectAll("p")
    .data(lines)
    .enter()
    .append("p")
    .style("cursor", "pointer")
    .html((l, i) => `${i + 1}. ${l.replace(/,/g, ", ")}`)
    .on("click", (e, l) => {
      closeModal(innovationListModal);
      searchField.value = l;
      search(searchField.value);
    });
});

function fillTracksCard(datasets) {
  // let tracksObject = datasets.tracks;
  let element = d3.select("#tracks-card");

  console.log("datasets", datasets);

  element.selectAll("div").remove();
  element
    .selectAll(".div")
    .data(datasets)
    .enter()
    .append("div")
    .classed("frcv-tracks-list-group", true)
    .html(
      (d) =>
        `<div class="frcv-tracks-list-group-headline">${d.label} (${d.tracks.length} Tracks)</div>`
    )
    .selectAll(".div")
    .data((d) =>
      d.tracks
        .sort((t1, t2) => d3.descending(t1.releaseYear, t2.releaseYear))
        .map((t) => [t, d.label])
    )
    .enter()
    .append("div")
    .style("cursor", "pointer")
    .html((item, index) => {
      let track = item[0];
      return [
        `<span class="index-number">${index + 1}.</span>`,
        `<span class="title">${track.title}</span>`,
        `<span class="artist">(${track.artist.trim()}, ${
          track.releaseYear
        })</span>`,
      ].join(" ");
    })
    .on("click", (event, item) => presentTrackPopup(item[0], item[1]));
}

function fillRecentSearchesPanel() {
  let colors = lotivis.colorSchemeLotivis10;
  let lines = recentSearches.queries();

  d3.select("#frcv-recent-searches").selectAll("p").remove();
  d3.select("#frcv-recent-searches")
    .selectAll("p")
    .data(lines)
    .enter()
    .append("p")
    .style("display", "block")
    .style("cursor", "pointer")
    .on("click", (e, l) => {
      closeModal(reacentSearchesModal);
      searchField.value = l;
      search(searchField.value);
    })
    .selectAll("span")
    .data((d, i) => [i + 1 + ". ", ...d.split(";")])
    .enter()
    .append("span")
    .style("color", (d, i) =>
      i == 0 ? colors[0] : colors[(i - 1) % colors.length]
    )
    .html((l) => l);
}

fillRecentSearchesPanel();
