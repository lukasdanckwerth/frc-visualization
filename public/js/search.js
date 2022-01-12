// configure lotivis
lotivis.config.downloadFilePrefix = "frcv";
lotivis.debug(true);

let d3 = lotivis.d3;

// create lotivis components
let barChart = new lotivis.BarChart("bar-chart", { labels: true });

let plotChart = new lotivis.PlotChart("plot-chart", { type: "fraction" });

let mapChart = new lotivis.MapChart("map-chart", {
  labels: true,
  excludedFeatureCodes: ["2A", "2B"],
  featureIDAccessor: (f) => f.properties.code,
  featureNameAccessor: (f) => f.properties.nom,
});

let contentContainer = document.getElementById("content");
let loadingView = document.getElementById("loading-indicator");
let searchField = document.getElementById("search-input");
let searchArea = document.getElementById("frcv-search-field-area");

contentContainer.style.display = "none";

let corpus = new frc.Corpus("");
let queryParameter = "q";
let parameters = lotivis.UrlParameters.getInstance();
let recentSearches = new RecentSearches("frcv-search-input-data");

// search options;
let firstYear = 2000;
let lastYear = 2020;
let sensitivity = document.getElementById("case-sensitivity").value;
let countType = frc.SEARCH_COUNT.tracks;

/* search */
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

  parameters.set(queryParameter, searchText);

  let datasets = corpus.search(
    searchText,
    firstYear,
    lastYear,
    sensitivity,
    countType
  );

  let dataController = new lotivis.parseDatasets(datasets);
  barChart.setController(dataController);
  mapChart.setController(dataController);
  plotChart.setController(dataController);

  fillTracksCard(datasets);
  recentSearches.append(searchText);
}

/* date range */
function updateYearsRange() {
  barChart.config.dateLabels = d3.range(firstYear, lastYear + 1);
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

  for (let year = 2000; year < 2021; year++) {
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

function fillTracksCard(datasets) {
  // let tracksObject = datasets.tracks;
  let element = d3.select("#tracks-card-content");

  console.log("datasets", datasets);

  element.selectAll("div").remove();
  element
    .selectAll("div")
    .data(datasets)
    .enter()
    .append("div")
    .html((dataset, index) => {
      let tracks = dataset.tracks;
      let components = index !== 0 ? [`<br>`] : [];
      components.push(`<b class="larger">`);
      components.push(`${dataset.label}`);
      components.push(` (${tracks.length} Tracks)`);
      components.push(`</b>`);

      return components.join("");
    })
    .selectAll("div")
    .data((dataset) => {
      let tracks = dataset.tracks;
      tracks.forEach((item) => (item.label = dataset.label));
      return tracks
        .sort((t1, t2) => d3.descending(t1.releaseYear, t2.releaseYear))
        .map((t) => [t, dataset.label]);
    })
    .enter()
    .append("div")
    .style("cursor", "pointer")
    .html((item, index) => {
      let track = item[0];
      let components = [];
      components.push(`<span class="index-number">${index + 1}</span>`);
      components.push(`<span class="title">${track.title}</span>`);
      components.push(
        `<span class="artist">(by ${track.artist}, ${track.releaseYear})</span>`
      );
      return `<div>${components.join(" ")}</div>`;
    })
    .on("click", (event, item) => presentTrackPopup(item[0], item[1]));
}

d3.json("./assets/departements.geojson").then((geoJSON) =>
  mapChart.setGeoJSON(geoJSON)
);

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
    let searchString = parameters.getString(queryParameter);
    if (!searchString) return;
    search(searchString);
    searchField.value = searchString;
    return;
  })
  .catch((error) => console.error(error));

d3.text("./assets/innovation.list.txt").then((text) => {
  let lines = text.split("\n").filter((line) => line.length > 0);
  d3.select("#innovation-list")
    .selectAll("a")
    .data(lines)
    .enter()
    .append("a")
    .html((l, i) => `<nobr>${i + 1}. ${l.split(";").join(`, `)}</nobr>`)
    .on("click", (e, l) => {
      searchField.value = l.split(";").join(`,`);
      searchFieldAction(searchField);
    });
});
