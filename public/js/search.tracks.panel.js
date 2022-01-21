function fillTracksCard(datasets) {
  // let tracksObject = datasets.tracks;
  let element = d3.select("#tracks-card");

  console.log("datasets", datasets);

  element.selectAll("div").remove();
  element
    .selectAll("div")
    .data(datasets)
    .enter()
    .append("div")
    .html((dataset, index) => {
      let tracks = dataset.tracks;
      return `<b class="larger">${dataset.label} (${tracks.length} Tracks)</b><br>`;
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
      return [
        `<div>`,
        `<span class="index-number">${index + 1}</span>`,
        `<span class="title">${track.title}</span>`,
        `<span class="artist">(by ${track.artist}, ${track.releaseYear})</span>`,
        `</div>`,
      ].join(" ");
    })
    .on("click", (event, item) => presentTrackPopup(item[0], item[1]));
}
