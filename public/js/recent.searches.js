const RecentSearchesLocalStorageKey =
  "de.beuth.frc-visualization.RecentSearchesLocalStorageKey";
const MaxItemsCount = 10000;

/**
 *
 * @class RecentSearches
 */
class RecentSearches {
  /**
   *
   */
  constructor(datalistID) {
    /**
     * The collection of recent searches.
     * @type {string[]}
     */
    let values = [];

    /**
     * Document datalist element.
     */
    let datalist = document.getElementById(datalistID);

    loadFromLocalStorage();
    refillDatalist();

    // MARK: - Connect View

    function refillDatalist() {
      if (!datalist) return;
      datalist.innerHTML = "";
      values.forEach(function (title) {
        let option = document.createElement("option");
        option.value = title;
        datalist.appendChild(option);
      });
    }

    // Mark: - Insert / Remove

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

    // MARK: - Local Storage

    function loadFromLocalStorage() {
      let wordlist = localStorage.getItem(RecentSearchesLocalStorageKey);
      if (wordlist) {
        values = wordlist.split("\n");
      } else {
        values = [];
      }
    }

    function storeToLocalStorage() {
      localStorage.setItem(RecentSearchesLocalStorageKey, values.join("\n"));
    }

    // MARK: - Public

    this.append = function (searchText) {
      removeIfExisting(searchText);
      insert(searchText);
      storeToLocalStorage();
      refillDatalist();
    };
  }
}
