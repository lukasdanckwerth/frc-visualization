import {Popup} from "../../../lotivis/src/js/components/popup";
import {LoadingView} from "../../../lotivis/src/js/components/loading-view";
import {Language} from "./language/language";

/**
 *
 * @class InnovationListPopup
 * @extends Popup
 */
export class InnovationListPopup extends Popup {

  constructor(parent) {
    super(parent);
  }

  render() {
    super.render();
    this.row = this.card.body
      .append('div')
      .classed('row word-list', true);
    this.card.headerRow
      .append('h3')
      .text(Language.translate('Innovation List'));
  }

  // MARK: - Override Popup

  willShow() {
    super.willShow();
    this.loadingView = new LoadingView(this.row);

    d3.text('/assets/innovation-list.txt')
      .then(function (data) {
        this.data = data.split('\n');
        this.loadingView.remove();
        this.dataDidLoad();
      }.bind(this))
      .catch(function () {
        this.data = [];
        this.dataDidLoad();
      }.bind(this));
  }

  preferredSize() {
    return {
      width: 400,
      height: 0,
    };
  }

  dataDidLoad() {
    let reducedData = this.data.map(function (item) {
      let components = item.split(';');
      return {
        title: components[0],
        variations: components.join(',')
      };
    });

    let thisReference = this;
    this.row
      .selectAll('div')
      .append('div')
      .data(reducedData)
      .enter()
      .append('div')
      .append('a')
      .append('span')
      .classed('representation', true)
      .text(item => item.title)
      .append('span')
      .classed('variations', true)
      .text(item => '(' + item.variations + ')')
      .on('click', function (item, some) {
        thisReference.searchCard.searchField.setText('' + some.variations);
        thisReference.searchCard.startSearching();
        thisReference.dismiss();
      });
  }
}
