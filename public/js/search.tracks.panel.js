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
        `<span class="index-number">${index + 1}</span>`,
        `<span class="title">${track.title}</span>`,
        `<span class="artist">(by ${track.artist}, ${track.releaseYear})</span>`,
      ].join(" ");
    })
    .on("click", (event, item) => presentTrackPopup(item[0], item[1]));
}
