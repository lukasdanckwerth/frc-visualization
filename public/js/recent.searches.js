const RecentSearchesLocalStorageKey =
  "de.beuth.frc-visualization.RecentSearchesLocalStorageKey";
const MaxItemsCount = 10000;

class RecentSearches {
  constructor(datalistID) {
    let values = [];
    let datalist = document.getElementById(datalistID);

    loadFromLocalStorage();
    refillDatalist();

    function refillDatalist() {
      if (!datalist) return;
      datalist.innerHTML = "";
      values.forEach(function (title) {
        let option = document.createElement("option");
        option.value = title;
        datalist.appendChild(option);
      });
    }

    function insert(value) {
      values.splice(0, 0, value);
      removeDispensableValues();
    }

    function removeIfExisting(value) {
      let index = values.indexOf(value);
      if (index < 0) return;
      values.splice(index, 1);
    }

    function removeDispensableValues() {
      if (values.length < MaxItemsCount) return;
      let tooMuch = values.length - MaxItemsCount;
      values.splice(MaxItemsCount, tooMuch);
    }

    function loadFromLocalStorage() {
      let wordlist = localStorage.getItem(RecentSearchesLocalStorageKey);
      values = wordlist ? wordlist.split("\n") : [];
    }

    function storeToLocalStorage() {
      localStorage.setItem(RecentSearchesLocalStorageKey, values.join("\n"));
    }

    this.append = function (searchText) {
      removeIfExisting(searchText);
      insert(searchText);
      storeToLocalStorage();
      refillDatalist();
    };
  }
}
