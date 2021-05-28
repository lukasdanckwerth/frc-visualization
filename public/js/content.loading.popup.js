class ContentLoadingPopup extends lotivis.Popup {

  constructor() {
    super(d3.select('body'));
    this.loadingView = this.card.content
      .append('div')
      .classed('frc-loading-card', true)
      .text('Loading...');
    this.card.content.classed('frcv-popup-container', true);
  }

  hideLoadingView() {
    this.loadingView.style('display', 'none');
  }

  loadContentFrom(path) {
    d3
      .text(path)
      .then(function (content) {
        this.card.content.html(content);
        this.hideLoadingView();
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  preferredSize() {
    return {width: 600, height: 400};
  }
}
