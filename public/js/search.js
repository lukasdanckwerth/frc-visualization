// configure lotivis
lotivis.debug(true);
lotivis.config({ downloadFilePrefix: "frcv" });

let d3 = lotivis.d3;

// create lotivis components
let barChart = lotivis
  .bar()
  .selector("#bar-chart")
  .marginTop(70)
  .marginLeft(70)
  .labels(true);

let legend = barChart
  .legend()
  .title(null)
  .group(true)
  .groupFormat(function (s, v, ls, i) {
    return `${i + 1}) ${ls[0]} (+ ${ls.length - 1}) (Sum: ${v})`;
  });

let plotChart = lotivis
  .plot()
  .selector("#plot-chart")
  .marginLeft(80)
  .style("fraction")
  .colorMode("single")
  .labels(true);

let mapChart = lotivis
  .map()
  .selector("#map-chart")
  .labels(true)
  .labelsExclude(["75", "92", "93", "94"])
  .legend(true)
  .exclude(["2A", "2B"])
  .featureIDAccessor((f) => f.properties.code)
  .featureNameAccessor((f) => f.properties.nom);

let mapChartParis = lotivis
  .map()
  .selector("#map-chart-paris")
  .width(400)
  .height(400)
  .labels(true)
  .legend(false)
  .include(["75", "92", "93", "94"])
  .featureIDAccessor((f) => f.properties.code)
  .featureNameAccessor((f) => f.properties.nom);

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
let firstYear = 2000;
let lastYear = 2020;
let sensitivity = document.getElementById("case-sensitivity").value;
let countType = frc.SearchCountType.tracks;

contentContainer.style.display = "none";

function screenshot(id) {
  let filename = barChart.dataController().filename(".png", id);
  html2canvas(getElement(id), { scale: 10 }).then((canvas) => {
    // download as base64 file
    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL();
    downloadLink.download = filename;
    downloadLink.click();
  });
}

function onLabelsBar() {
  barChart.config.labels = getElement("labelsBar").checked;
}

function onLabelsMap() {
  mapChart.config.labels = getElement("labelsMap").checked;
}

function onLabelsPlot() {
  plotChart.config.labels = getElement("labelsPlot").checked;
}

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

function fillRecentSearchesPanel() {
  let colors = lotivis.DATA_COLORS;
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
