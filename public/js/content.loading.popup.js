class ContentLoadingPopup extends lotivis.Popup {

  constructor() {
    super(d3.select('body'));
    this.loadingView = this.card.body
      .append('div')
      .classed('frc-loading-card', true)
      .text('Loading...');
    this.card.content = this.card.body.append('div').classed('frcv-container', true);
  }

  hideLoadingView() {
    this.loadingView.style('display', 'none');
  }

  setContent(newContent) {
    this.card.content.html(newContent);
    this.hideLoadingView();
  }

  setContentFrom(elementID) {
    let content = d3.select(elementID).html();
    this.setContent(content);
  }

  loadContentFrom(path) {
    d3
      .text(path)
      .then(function (content) {
        this.setContent(content);
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  preferredSize() {
    return {width: 600, height: 400};
  }
}
