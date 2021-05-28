
function yearCollectionToDataset(yearCollection, name) {
  let years = Object.getOwnPropertyNames(yearCollection);
  let dataset = {
    label: name,
    stack: name,
    data: []
  }

  for (let index = 0; index < years.length; index++) {
    let year = years[index];
    let value = yearCollection[year];
    dataset.data.push({
      label: year,
      value: value,
      date: year,
      dateTotal: value
    })
  }

  return dataset;
}

exports.yearCollectionToDataset = yearCollectionToDataset;
