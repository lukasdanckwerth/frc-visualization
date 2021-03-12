const RecentSearchesLocalStorageKey = 'de.beuth.frc-visualization.RecentSearchesLocalStorageKey';
const MaxItemsCount = 100;
const UseLocalStorage = true;

export class RecentSearches {
  constructor() {
    this.loadFromLocalStorage();
  }

  static getInstance() {
    if (!RecentSearches.instance) {
      RecentSearches.instance = new RecentSearches();
    }
    return RecentSearches.instance;
  }


  // Mark: - Append / Insert

  append(searchText) {
    this.removeIfExisting(searchText);
    this.insert(searchText);
    this.storeToLocalStorage();
  }

  insert(value) {
    this.values.splice(0, 0, value);
    this.removeDispensableValues();
  }


  // MARK: - Remove

  removeIfExisting(value) {
    let index = this.values.indexOf(value);
    if (index < 0) return;
    this.values.splice(index, 1);
  }

  removeDispensableValues() {
    if (this.values.length < MaxItemsCount) return;
    let tooMuch = this.values.length - MaxItemsCount;
    console.log("tooMuch: " + tooMuch);
    this.values.splice(MaxItemsCount, tooMuch);
  }


  // MARK: - Local Storage

  loadFromLocalStorage() {
    let wordlist = localStorage.getItem(RecentSearchesLocalStorageKey);
    if (wordlist) {
      this.values = wordlist.split('\n');
    } else {
      this.values = [];
    }
  }

  storeToLocalStorage() {
    localStorage.setItem(RecentSearchesLocalStorageKey, this.values.join('\n'));
  }
}
