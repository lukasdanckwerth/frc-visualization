import {Corpus} from "./corpus";

Corpus.prototype.combineData = function (data) {
  let combined = [];
  data.forEach(function (item) {
    let candidate = combined.find(dataset =>
      dataset.location === item.location && dataset.date === item.date);
    if (candidate) {
      candidate.value += item.value;
    } else {
      combined.push({
        date: item.date,
        location: item.location,
        value: item.value
      });
    }
  });
  return combined;
};
