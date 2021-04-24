import {Component} from "./component";
import {createID} from "../shared/selector";
import {RecentSearches} from "../../../../frc-visualization/src/shared/recent-searches";

export class SearchField extends Component {

  constructor(parent) {
    super(parent);
    if (!parent) {
      throw 'No parent specified.';
    }
    this.parent = parent;
    this.datalistId = createID();
    this.element = parent
      .append('input')
      .classed('form-control form-control-sm', true)
      .attr('type', 'text')
      .attr('placeholder', 'Search Word')
      .attr('id', this.selector)
      .attr('list', this.datalistId);

    this.datalist = parent
      .append('datalist')
      .attr('id', this.datalistId);

    this.element.on('keyup', function (event) {
      if (event.key !== 'Enter') return;
      this.onEnter();
    }.bind(this));

    this.element.on('change', function (event) {
      this.onEnter();
    }.bind(this));

    this.updateRecentSearches();
  }

  onEnter() {
    // empty
  }

  startSearch(searchText) {
    // empty
  }

  getText() {
    let element = document.getElementById(this.selector);
    return element.value;
  }

  setText(newValue) {
    let element = document.getElementById(this.selector);
    element.value = newValue;
  }

  updateRecentSearches() {
    this.datalist
      .selectAll('option')
      .remove();
    let recentSearches = RecentSearches.getInstance().values || [];
    this.datalist
      .selectAll('option')
      .data(recentSearches)
      .enter()
      .append("option")
      .attr('value', (item) => item);
  }
}
