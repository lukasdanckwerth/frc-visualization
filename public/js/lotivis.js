/*!
 * lotivis.js v1.0.1
 * https://github.com/lukasdanckwerth/lotivis#readme
 * (c) 2021 lotivis.js Lukas Danckwerth
 * Released under the MIT License
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.lotivis = {}));
}(this, (function (exports) { 'use strict';

function createUUID() {
    let usedIDs;
    usedIDs = [];
    function generate() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    let uuid = generate();
    while (usedIDs.indexOf(uuid) >= 0) {
        uuid = generate();
    }
    return "id-" + uuid;
}

class Component {
    constructor(parent) {
        if (!parent) {
            throw 'No parent specified.';
        }
        this.selector = createUUID();
        this.parent = parent;
    }
    show() {
        if (!this.element) return;
        this.element.style('display', 'inline-block');
    }
    hide() {
        if (!this.element) return;
        this.element.style('display', 'none');
    }
    get isVisible() {
        if (!this.element) return false;
        return this.element.style('display') !== 'none';
    }
}

class Button extends Component {
  constructor(parent) {
    super(parent);
    let thisRef = this;
    this.element = parent
      .append('button')
      .attr('id', this.selector)
      .on('click', function (event) {
        if (!thisRef.onClick) return;
        thisRef.onClick(event);
      });
  }
  setText(text) {
    this.element.text(text);
  }
  setFontAwesomeImage(imageName) {
    this.element.html('<i class="fas fa-' + imageName + '"></i>');
  }
  onClick(event) {
  }
}

class URLParameters {
  static getInstance() {
    if (!URLParameters.instance) {
      URLParameters.instance = new URLParameters();
    }
    return URLParameters.instance;
  }
  getURL() {
    return new URL(window.location.href);
  }
  getBoolean(parameter, defaultValue = false) {
    let value = this.getURL().searchParams.get(parameter);
    return value ? value === 'true' : defaultValue;
  }
  getString(parameter, defaultValue = '') {
    return this.getURL().searchParams.get(parameter) || defaultValue;
  }
  set(parameter, newValue) {
    const url = this.getURL();
    if (newValue === false) {
      url.searchParams.delete(parameter);
    } else {
      url.searchParams.set(parameter, newValue);
    }
    window.history.replaceState(null, null, url);
    this.updateCurrentPageFooter();
  }
  setWithoutDeleting(parameter, newValue) {
    const url = this.getURL();
    url.searchParams.set(parameter, newValue);
    window.history.replaceState(null, null, url);
    this.updateCurrentPageFooter();
  }
  clear() {
    const url = this.getURL();
    const newPath = url.protocol + url.host;
    const newURL = new URL(newPath);
    window.history.replaceState(null, null, newURL);
    this.updateCurrentPageFooter();
  }
  updateCurrentPageFooter() {
    console.log('window.lotivisApplication: ' + window.lotivisApplication);
    window.lotivisApplication.currentPage.updateFooter();
  }
}
URLParameters.language = 'language';
URLParameters.page = 'page';
URLParameters.query = 'query';
URLParameters.searchViewMode = 'search-view-mode';
URLParameters.chartType = 'chart-type';
URLParameters.chartShowLabels = 'chart-show-labels';
URLParameters.chartCombineStacks = 'chart-combine-stacks';
URLParameters.contentType = 'content-type';
URLParameters.valueType = 'value-type';
URLParameters.searchSensitivity = 'search-sensitivity';
URLParameters.startYear = 'start-year';
URLParameters.endYear = 'end-year';
URLParameters.showTestData = 'show-test-data';

const Strings = {
    greeting: 'Hallo Welt',
    'French Rap Corpus Visualization': 'Französiche Rap Corpus Visualisierung',
    'Version': 'Version',
    'Server': 'Server',
    'Search': 'Suchen',
    'Diachronic Data': 'Diachronische Daten',
    'Diatopic Data': 'Diatopische Daten',
    'Corpus Data': 'Korpus Daten',
    'Artists Data': 'KünstlerInnen Daten',
    'About the Project': 'Über das Projekt',
    'Click on URL to copy it to clipboard': 'Klicken Sie auf die URL, um sie in die Zwischenablage zu kopieren',
    'Tracks': 'Lieder',
    'Words': 'Wörter',
    'Words (Relative)': 'Wörter (Relativ)',
    'Types': 'Typen',
    'Types (Relative)': 'Typen (Relativ)',
    'true': 'Ja',
    'false': 'Nein',
    'Back': 'Zurück',
    'Loading...': 'Laden...',
    'Settings': 'Einstellungen',
    'Chart': 'Diagramm',
    'Close': 'Schließen',
    'Half': 'Halb',
    'Full': 'Voll',
    'from': 'von',
    'till': 'bis',
    'Relative': 'Relativ',
    'Absolute': 'Absolut',
    'Innovation List': 'Innovations-Liste',
    'View Mode': 'Ansicht',
    'Map': 'Karte',
    'Impress': 'Impressum',
    'Privacy Policy': 'Datenschutzerklärung',
    'Corpus loaded status': 'Korpus geladen',
    'Language': 'Sprache',
};

const Strings$1 = {
    greeting: 'Hello World',
    'French Rap Corpus Visualization': 'French Rap Corpus Visualization',
    'Version': 'Version',
    'Server': 'Server',
    'Search': 'Search',
    'Diachronic About': 'Diachronic About',
    'Corpus Metadata': 'Corpus Metadata',
    'Artists Metadata': 'Artists Metadata',
    'About': 'About',
    'Click on URL to copy it to clipboard': 'Click on URL to copy it to clipboard',
    'true': 'Yes',
    'false': 'No',
    'Back': 'Back',
    'Loading...': 'Loading...',
    'Impress': 'Impress',
    'Privacy Policy': 'Privacy Policy',
    'Corpus loaded status': 'Corpus loaded status',
    'Language': 'Language',
};

const Strings$2 = {
    greeting: 'Bonjour le monde',
    'French Rap Corpus Visualization': 'Visualisation du corpus rap français ',
    'Version': 'Version',
    'Server': 'Serveur',
    'Search': 'Chercher',
    'Diachronic About': 'Diachronic About',
    'Corpus Metadata': 'Métadonnées du corpus ',
    'Artists Metadata': 'Métadonnées des artistes',
    'About the Project': 'À propos du projet',
    'Click on URL to copy it to clipboard': 'Cliquez sur l\'URL pour la copier dans le presse-papiers',
    'true': 'Oui',
    'false': 'Non',
    'Back': 'Arrière',
    'Loading...': 'Chargement...',
    'Close': 'Conclure',
    'Impress': 'Impressionner',
    'Privacy Policy': 'Politique de confidentialité',
    'Corpus loaded status': 'Corpus chargé',
    'Language': 'Langue',
};

const Language = {
    English: 'en_EN',
    German: 'de_DE',
    French: 'fr_FR'
};
Language.language = Language.English;
Language.strings = Strings$1;
Language.setLanguage = function (language) {
    switch (language) {
        case Language.English:
            Language.strings = Strings$1;
            break;
        case Language.German:
            Language.strings = Strings;
            break;
        case Language.French:
            Language.strings = Strings$2;
            break;
    }
    Language.language = language;
};
Language.translate = function (string) {
    if (Language.language === Language.English) {
        return Language.strings[string] || string;
    } else {
        return Language.strings[string] || ('='.repeat(string.length));
    }
};

class RadioGroup extends Component {
    constructor(parent) {
        super(parent);
        this.inputElements = [];
        this.element = parent.append('form');
        this.element.classed('radio-group', true);
    }
    addOption(optionId, optionName) {
        let inputElement = this.element
            .append('input')
            .attr('type', 'radio')
            .attr('name', this.selector)
            .attr('value', optionId)
            .attr('id', optionId);
        this.element
            .append('label')
            .attr('for', optionId)
            .text(optionName || optionId);
        let thisReference = this;
        inputElement.on("click", function (event) {
            thisReference.onClick(event);
        });
        return inputElement;
    }
    setOptions(options) {
        this.removeOptions();
        this.inputElements = [];
        for (let i = 0; i < options.length; i++) {
            let id = options[i][0] || options[i].id;
            let name = options[i][1] || options[i].translatedTitle;
            let inputElement = this.addOption(id, name);
            if (i === 0) {
                inputElement.attr('checked', 'true');
            }
            this.inputElements.push(inputElement);
        }
        return this;
    }
    setSelectedOption(selectedOption) {
        for (let i = 0; i < this.inputElements.length; i++) {
            let inputElement = this.inputElements[i];
            let value = inputElement.attr('value');
            if (value === selectedOption) {
                inputElement.attr('checked', 'true');
            }
        }
        return this;
    }
    removeOptions() {
        this.element.selectAll('input').remove();
        this.element.selectAll('label').remove();
        this.inputElements = [];
        return this;
    }
    onClick(event) {
        let element = event.target;
        if (!element) return;
        let value = element.value;
        if (!this.onChange) return;
        this.onChange(value);
        return this;
    }
    onChange(value) {
    }
}

class Card extends Component {
    constructor(parent) {
        super(parent);
        this.element = this.parent
            .append('div')
            .classed('card', true);
        this.createHeader();
        this.createBody();
        this.createFooter();
    }
    createHeader() {
        this.header = this.element
            .append('div')
            .classed('card-header', true);
        this.headerRow = this.header
            .append('div')
            .classed('row', true);
        this.headerLeftComponent = this.headerRow
            .append('div')
            .classed('col-3', true);
        this.headerCenterComponent = this.headerRow
            .append('div')
            .classed('col-6', true);
        this.headerRightComponent = this.headerRow
            .append('div')
            .classed('col-3 button-group', true)
            .classed('text-end', true);
        this.titleLabel = this.headerLeftComponent
            .append('span')
            .text(this.name);
    }
    createBody() {
        this.body = this.element
            .append('div')
            .classed('card-body', true);
        this.content = this.body
            .append('div')
            .attr('id', 'content');
    }
    createFooter() {
        this.footer = this.element
            .append('div')
            .classed('card-footer', true);
        this.footerRow = this.footer
            .append('div')
            .classed('row', true);
        this.footerLeftComponent = this.footerRow
            .append('div')
            .classed('col-6', true);
        this.footerRightComponent = this.footerRow
            .append('div')
            .classed('col-6', true)
            .classed('text-end', true);
        this.footer.style('display', 'none');
    }
}

class Popup extends Component {
    constructor(parent) {
        super(parent);
        this.renderUnderground(parent);
        this.renderContainer();
        this.renderCard();
        this.render();
        this.renderCloseButton();
        this.addCloseActionListeners();
    }
    render() {
    }
    renderUnderground(parent) {
        this.modalBackgroundId = createUUID();
        this.modalBackground = parent
            .append('div')
            .classed('popup-underground fade-in', true)
            .attr('id', this.modalBackgroundId);
    }
    renderContainer() {
        this.elementId = createUUID();
        this.element = this.modalBackground
            .append('div')
            .classed('popup', true)
            .attr('id', this.elementId);
    }
    renderCard() {
        this.card = new Card(this.element);
        this.card.element.classed('popup arrow arrow-right', true);
    }
    renderCloseButton() {
        this.closeButton = new Button(this.card.headerRightComponent);
        this.closeButton.element.classed('button-small', true);
        this.closeButton.setText(Language.translate('Close'));
    }
    addCloseActionListeners() {
        let validIDs = [
            this.closeButton.selector,
            this.modalBackgroundId
        ];
        let popup = this;
        this.modalBackground.on('click', function (event) {
            if (!event || !event.target) return;
            if (!validIDs.includes(event.target.id)) return;
            popup.dismiss();
        });
    }
    willShow() {
    }
    didShow() {
    }
    show() {
        if (this.willShow) this.willShow();
        this.getUnderground().style.display = 'block';
        if (this.didShow) this.didShow();
    }
    willDismiss() {
    }
    willRemoveDOMElement() {
    }
    dismiss() {
        if (this.willDismiss) this.willDismiss();
        this.getUnderground().style.display = 'none';
        if (this.willRemoveDOMElement) this.willRemoveDOMElement();
        this.getUnderground().remove();
    }
    getUnderground() {
        return document.getElementById(this.modalBackgroundId);
    }
    showUnder(sourceElement, position = 'center') {
        if (!sourceElement) return;
        let preferredSize = this.preferredSize();
        let origin = this.calculateBottomCenter(sourceElement);
        if (position === 'left') {
            origin.x -= origin.width / 2;
        } else if (position === 'right') {
            origin.x -= preferredSize.width - origin.width / 2;
        } else {
            origin.x -= (preferredSize.width / 2);
        }
        let id = this.elementId;
        let popup = document.getElementById(id);
        popup.style.position = 'absolute';
        popup.style.width = preferredSize.width + 'px';
        popup.style.left = origin.x + 'px';
        popup.style.top = origin.y + 'px';
        this.show();
    }
    showBigModal() {
        let id = this.elementId;
        let popup = document.getElementById(id);
        let preferredSize = this.preferredSize();
        popup.style.position = 'relative';
        popup.style.margin = '50px auto';
        popup.style.width = preferredSize.width + 'px';
        this.show();
    }
    preferredSize() {
        return {
            width: 300,
            height: 300
        };
    }
    calculateBottomCenter(element, respectWindowScroll = false) {
        let rect = element.getBoundingClientRect();
        let x = rect.x + (rect.width / 2);
        let y = rect.y + rect.height;
        if (respectWindowScroll) {
            x += window.scrollX;
            y += window.scrollY;
        }
        return {
            x: x,
            y: y,
            width: rect.width,
            height: rect.height
        };
    }
}

class ModalPopup extends Popup {
    constructor(parent) {
        super(parent);
        this.modalBackground
            .classed('popup-underground', false)
            .classed('modal-underground', true);
    }
    render() {
        super.render();
        this.renderRow();
    }
    renderRow() {
        this.row = this.card.body
            .append('div')
            .classed('row', true);
        this.content = this.row
            .append('div')
            .classed('col-12 info-box-margin', true);
    }
    loadContent(url) {
        if (!url) return;
        console.log('url: ' + url);
        let content = this.content;
        d3.text(url)
            .then(function (text) {
                console.log(text);
                content.html(text);
            })
            .catch(function (error) {
                console.log(error);
                content.html(Language.translate(''));
            });
    }
    preferredSize() {
        return {
            width: 800,
            height: 600
        };
    }
}

class Page {
  constructor(application, title = 'Unknown') {
    if (!application) {
      throw 'No application given.';
    }
    this.title = title || 'Unknown';
    this.application = application;
    this.element = application.element;
    this.renderHeader();
    this.renderBody();
    this.renderFooter();
    application.makeContainerNormal();
    document.title = 'FRC-Visualization - ' + this.title;
  }
  buildSubpage() {
    this.titleLabel = this.centerHeaderContainer.append('h1')
      .text(this.title);
  }
  addRow(toParent = this.element) {
    return this.addContainer(toParent, 'row');
  }
  addContainer(toParent = this.element, classes = '') {
    let parent = toParent || this.element;
    return parent
      .append('div')
      .classed(classes, true);
  }
  setTitle(newTitle) {
    this.title = newTitle;
    this.titleLabel.text(newTitle);
  }
  addSpace(toParent = this.element, width) {
    toParent
      .append('label')
      .style('width', width + 'px');
    return this;
  }
  renderHeader() {
    this.headerRow = this.addRow(this.element)
      .classed('row margin-bottom', true);
    this.leftHeaderContainer = this.headerRow
      .append('div')
      .classed('col-3', true);
    this.centerHeaderContainer = this.headerRow
      .append('div')
      .classed('col-6 text-center', true);
    this.rightHeaderContainer = this.headerRow
      .append('div')
      .classed('col-3 text-end button-group', true);
    this.backButton = this.addBackButton(this.leftHeaderContainer);
  }
  renderBody() {
    this.row = this.addRow(this.element);
  }
  renderFooterRow() {
    this.footerRow = this.addRow(this.element)
      .classed('footer', true);
  }
  renderFooterLinks() {
    this.footerLinksContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);
    this.footerLinksContainer
      .append('a')
      .text(Language.translate('Impress'))
      .on('click', function () {
        let language = Language.language;
        let url = `/html/impress-${language}.html`;
        this.presentModalPopup(url);
      }.bind(this));
    this.footerLinksContainer
      .append('a')
      .text(Language.translate('Privacy Policy'))
      .on('click', function () {
        let language = Language.language;
        let url = `/html/privacy-policy-${language}.html`;
        this.presentModalPopup(url);
      }.bind(this));
    this.footerLinksContainer
      .append('a')
      .text(Language.translate('About the Project'))
      .on('click', function () {
        let language = Language.language;
        let url = `/html/about-project-${language}.html`;
        this.presentModalPopup(url);
      }.bind(this));
  }
  presentModalPopup(contentURL) {
    let parent = window.frcvApp.element;
    let impressPopup = new ModalPopup(parent);
    impressPopup.loadContent(contentURL);
    impressPopup.showBigModal();
  }
  renderFooterURL() {
    this.footerURLContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);
    this.footerURLContainer.append('br');
    this.footerTooltipContainer = this.footerURLContainer
      .append('div')
      .classed('tooltip', true);
    this.footerURLLabel = this.footerTooltipContainer
      .append('a')
      .append('samp')
      .on('click', this.copyLocationToClipboard);
    let text = Language.translate('Click on URL to copy it to clipboard');
    this.footerURLLabelTooltip = this.footerTooltipContainer
      .append('span')
      .classed('tooltiptext', true)
      .text(text);
  }
  copyLocationToClipboard() {
    let urlPath = window.location.href;
    navigator.clipboard.writeText(urlPath).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }
  renderFooterCorpusInfo() {
    this.footerCorpusInfoContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);
    this.footerDebugLabel = this.footerCorpusInfoContainer
      .append('samp');
    this.updateFooterDebugInfo();
  }
  renderFooterLanguageInfo() {
    this.footerLanguageInfoContainer = this.footerRow
      .append('div')
      .classed('col-12 text-center', true);
    this.footerLanguageLabel = this.footerLanguageInfoContainer
      .append('samp');
    this.footerLanguageRadioGroup = new RadioGroup(
      this.footerLanguageInfoContainer
    );
    this.footerLanguageRadioGroup.setOptions([
      [Language.English, 'English'],
      [Language.German, 'German'],
      [Language.French, 'French'],
    ]);
    this.footerLanguageRadioGroup.onChange = function (value) {
      Language.setLanguage(value);
      URLParameters.getInstance().set(URLParameters.language, value);
      Application.default.reloadPage();
    };
    this.footerLanguageRadioGroup.setSelectedOption(
      Language.language
    );
  }
  renderFooter() {
    this.renderFooterRow();
    this.renderFooterLinks();
    this.renderFooterURL();
    this.renderFooterCorpusInfo();
    this.renderFooterLanguageInfo();
  }
  updateFooter() {
    this.updateFooterURL();
    this.updateFooterDebugInfo();
  }
  updateFooterURL() {
    let url = URLParameters.getInstance().getURL();
    this.footerURLLabel.text(url);
  }
  updateFooterDebugInfo() {
    let label = Language.translate('Corpus loaded status');
    let isCorpusLoaded = this.application.isCorpusLoaded();
    let valueTranslated = Language.translate('' + isCorpusLoaded);
    this.footerDebugLabel.text(`${label}: ${valueTranslated}`);
  }
  addLoadingView(toParent = this.element) {
    toParent.loadingView = toParent
      .append('div')
      .classed('loading-container', true);
    toParent.loadingView
      .append('div')
      .classed('loading-card', true)
      .text(Language.translate('Loading...'));
    return toParent.loadingView;
  }
  showLoadingView() {
    this.loadingView = this.addLoadingView(this.element);
  }
  hideLoadingView() {
    if (!this.loadingView) return;
    this.loadingView.remove();
  }
  addBackButton(toParent = this.element) {
    let button = new Button(toParent);
    button.element.classed('back-button', true);
    button.setText(Language.translate('Back'));
    let applicationReference = this.application;
    button.onClick = function () {
      applicationReference.showPage('main', true);
    };
    return button;
  }
  showBackButton() {
    this.backButton.element.style('visibility', 'visible');
  }
  hideBackButton() {
    this.backButton.element.style('visibility', 'hidden');
  }
  loadCorpusIfNeeded() {
    this.willLoadCorpus();
    if (this.application.isCorpusLoaded()) {
      this.didLoadCorpus();
    } else {
      let ref = this;
      this.application.loadCorpus(function () {
        ref.didLoadCorpus();
      });
    }
  }
  willLoadCorpus() {
  }
  didLoadCorpus() {
    this.updateFooterURL();
    this.updateFooterDebugInfo();
  }
}

class Option {
    constructor(id, title) {
        this.id = id;
        this.title = title || id;
    }
    get translatedTitle() {
        return Language.translate(this.title);
    }
}

class Checkbox extends Component {
    constructor(parent) {
        super(parent);
        this.renderInput();
        this.renderLabel();
    }
    renderInput() {
        let thisReference = this;
        this.element = this.parent
            .classed('radio-group', true)
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', this.selector)
            .on('click', function (event) {
                if (!event.target) {
                    return;
                }
                let checkbox = event.target;
                if (thisReference.onClick) {
                    thisReference.onClick(checkbox.checked);
                }
            });
    }
    renderLabel() {
        this.label = this.parent
            .append('label')
            .attr('for', this.selector)
            .text('Unknown');
    }
    setText(text) {
        this.label.text(text);
        return this;
    }
    setChecked(checked) {
        this.element.attr('checked', checked === true ? checked : null);
        return this;
    }
    onClick(checked) {
        console.log('onClick: ' + checked);
    }
    enable() {
        this.element.attr('disabled', null);
        this.label.style('color', 'black');
    }
    disable() {
        this.element.attr('disabled', true);
        this.label.style('color', 'gray');
    }
}

class SearchPageSettingsPopup extends Popup {
    preferredSize() {
        return {width: 320, height: 300};
    }
    render() {
        this.renderViewRadioGroup();
        this.renderShowChartCheckbox();
        this.renderShowMapCheckbox();
        this.renderShowWordAboutCheckbox();
    }
    renderCard() {
        super.renderCard();
        this.row = this.card.body
            .append('div')
            .classed('row margin-top', true);
    }
    renderViewRadioGroup() {
        this.viewRadioGroupLabel = this.row
            .append('div')
            .classed('col-4 text-end', true)
            .text(Language.translate('View Mode') + ':');
        this.viewRadioGroupContainer = this.row
            .append('div')
            .classed('col-8', true);
        this.viewRadioGroup = new RadioGroup(this.viewRadioGroupContainer);
        this.viewRadioGroup.setOptions([
            new Option('half', 'Half'),
            new Option('full', 'Full')
        ]);
        this.viewRadioGroup.onChange = function (value) {
            if (!this.searchPage) return;
            this.searchPage.setViewMode(value, true);
            URLParameters.getInstance().set(URLParameters.searchViewMode, value);
        }.bind(this);
    }
    renderShowChartCheckbox() {
        this.showChartCheckboxLabel = this.row.append('div').classed('col-4 text-end', true);
        this.showChartCheckboxContainer = this.row.append('div').classed('col-8', true);
        this.showChartCheckbox = new Checkbox(this.showChartCheckboxContainer);
        this.showChartCheckbox.setText(Language.translate('Show Chart'));
        this.showChartCheckbox.onClick = function (value) {
            value ? this.searchPage.showChart() : this.searchPage.hideChart();
            URLParameters.getInstance().setWithoutDeleting('show-chart', value);
        }.bind(this);
    }
    renderShowMapCheckbox() {
        this.showMapCheckboxLabel = this.row.append('div').classed('col-4 text-end', true);
        this.showMapCheckboxContainer = this.row.append('div').classed('col-8', true);
        this.showMapCheckbox = new Checkbox(this.showMapCheckboxContainer);
        this.showMapCheckbox.setText(Language.translate('Show Map'));
        this.showMapCheckbox.onClick = function (value) {
            value ? this.searchPage.showMap() : this.searchPage.hideMap();
            URLParameters.getInstance().setWithoutDeleting('show-map', value);
        }.bind(this);
    }
    renderShowWordAboutCheckbox() {
        this.showWordAboutCheckboxLabel = this.row.append('div').classed('col-4 text-end', true);
        this.showWordAboutCheckboxContainer = this.row.append('div').classed('col-8', true);
        this.showWordAboutCheckbox = new Checkbox(this.showWordAboutCheckboxContainer);
        this.showWordAboutCheckbox.setText(Language.translate('Show Word About'));
        this.showWordAboutCheckbox.onClick = function (value) {
            value ? this.searchPage.showWordAbout() : this.searchPage.hideWordAbout();
            URLParameters.getInstance().setWithoutDeleting('show-word-about', value);
        }.bind(this);
    }
    willShow() {
        super.willShow();
        this.card.headerRow.append('h3').text(Language.translate('Settings'));
        this.loadValues();
    }
    loadValues() {
        let searchPage = this.searchPage;
        this.viewRadioGroup.setSelectedOption(searchPage.viewMode);
        this.showChartCheckbox.setChecked(searchPage.diachronicChartCard.isVisible);
        this.showMapCheckbox.setChecked(searchPage.mapChartCard.isVisible);
        this.showWordAboutCheckbox.setChecked(searchPage.wordAboutCard.isVisible);
    }
}
SearchPageSettingsPopup.ViewMode = {
    Half: 'Half',
    Full: 'Full'
};

function randomColor() {
  return "rgb(" +
    (Math.random() * 255) + ", " +
    (Math.random() * 255) + "," +
    (Math.random() * 255) + ")";
}
class Color {
  constructor(r, g, b) {
    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
  }
  rgbString() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }
  colorAdding(r, g, b) {
    return new Color(this.r + r, this.g + g, this.b + b);
  }
}
Color.organgeLow = new Color(250, 211, 144);
Color.organgeHigh = new Color(229, 142, 38);
Color.redLow = new Color(248, 194, 145);
Color.redHigh = new Color(183, 21, 64);
Color.blueLow = new Color(106, 137, 204);
Color.blueHigh = new Color(12, 36, 97);
Color.lightBlueLow = new Color(130, 204, 221);
Color.lightBlueHight = new Color(10, 61, 98);
Color.greenLow = new Color(184, 233, 148);
Color.greenHight = new Color(7, 153, 146);
Color.stackColors = [
  [Color.blueHigh, Color.blueLow],
  [Color.redHigh, Color.redLow],
  [Color.greenHight, Color.greenLow],
  [Color.organgeHigh, Color.organgeLow],
  [Color.lightBlueHight, Color.lightBlueLow],
];
function colorsForStack(stack, amount) {
  if (!Number.isInteger(stack)) {
    return [Color.stackColors[0]];
  }
  let usedAmount = Math.max(amount, 5);
  let stackColors = Color.stackColors[stack % Color.stackColors.length];
  let highColor = stackColors[0];
  let lowColor = stackColors[1];
  let redDiff = lowColor.r - highColor.r;
  let greenDiff = lowColor.g - highColor.g;
  let blueDiff = lowColor.b - highColor.b;
  let redStep = redDiff / usedAmount;
  let greenStep = greenDiff / usedAmount;
  let blueStep = blueDiff / usedAmount;
  let colors = [];
  for (let i = 0; i < amount; i++) {
    let newColor = highColor.colorAdding(redStep * i, greenStep * i, blueStep * i);
    colors.push(newColor);
  }
  return colors;
}

class TestData {
}
TestData.datasets = [
  {
    label: 'Merde',
    stack: 'Merde',
    data: [
      {label: 2012, year: 2012, yearTotal: 100, value: 12},
      {label: 2013, year: 2013, yearTotal: 120, value: 24},
      {label: 2014, year: 2014, yearTotal: 140, value: 12},
    ]
  },
  {
    label: 'Gucci',
    stack: 'Gucci,Lacoste',
    data: [
      {label: 2012, year: 2012, yearTotal: 100, value: 5},
      {label: 2013, year: 2013, yearTotal: 120, value: 10},
      {label: 2014, year: 2014, yearTotal: 140, value: 15},
    ]
  },
  {
    label: 'Lacoste',
    stack: 'Gucci,Lacoste',
    data: [
      {label: 2012, year: 2012, yearTotal: 100, value: 8},
      {label: 2013, year: 2013, yearTotal: 120, value: 8},
      {label: 2014, year: 2014, yearTotal: 140, value: 5},
    ]
  },
  {
    label: 'Nike',
    stack: 'Nike,Puma',
    data: [
      {label: 2012, year: 2012, yearTotal: 100, value: 2},
      {label: 2013, year: 2013, yearTotal: 120, value: 4},
      {label: 2014, year: 2014, yearTotal: 140, value: 20},
    ]
  },
  {
    label: 'Puma',
    stack: 'Nike,Puma',
    data: [
      {label: 2012, year: 2012, yearTotal: 100, value: 15},
      {label: 2013, year: 2013, yearTotal: 120, value: 30},
      {label: 2014, year: 2014, yearTotal: 140, value: 10},
    ]
  }
];

class DiachronicChart extends Component {
  constructor(parent) {
    super(parent);
    if (!parent) {
      throw 'No parent specified.';
    }
    if (Object.getPrototypeOf(parent) === String.prototype) {
      this.selector = parent;
      this.element = d3.select('#' + parent);
    } else {
      this.element = parent;
    }
    this.initialize();
    this.update();
  }
  initialize() {
    this.width = 1000;
    this.height = 600;
    this.defaultMargin = 60;
    this.margin = {
      top: this.defaultMargin,
      right: this.defaultMargin,
      bottom: this.defaultMargin,
      left: this.defaultMargin
    };
    this.datasets = [];
    this.presentedDatasetGroups = [];
    this.presentedStacks = [];
    this.labelColor = new Color(155, 155, 155).rgbString();
    this.type = DiachronicChart.ChartType.Bar;
    this.valueType = 'relative';
    this.isShowLabels = false;
    this.isCombineStacks = false;
    this.numberFormat = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 3
    });
    if (URLParameters.getInstance().getBoolean(URLParameters.showTestData)) {
      this.datasets = TestData.datasets;
    }
  }
  set datasets(datasets) {
    this._datasets = datasets;
    this._datasets.forEach(dataset => dataset.isEnabled = true);
  }
  update() {
    this.beforeDrawChart();
    this.drawChart();
    this.afterDrawChart();
  }
  beforeDrawChart() {
    this.configureChart();
    this.calculatePresentedDatasets();
    this.calculateListOfDatasetNames();
    this.calculateListOfYears();
    this.calculateListOfStacks();
    this.calculateFlattenData();
    this.calculateDatasetsPerYear();
    this.calculateColors();
    this.calculateDatasetStacks();
  }
  drawChart() {
    this.createSVG();
    this.createGraph();
    this.createScales();
    this.createAxis();
    this.renderAxis();
    this.renderGrid();
    this.renderStacks();
    this.renderLegend();
  }
  configureChart() {
    this.renderMethod = this.type === 'Bar' ? this.renderBars : this.renderLine;
    let margin = this.margin;
    this.graphWidth = this.width - margin.left - margin.right;
    this.graphHeight = this.height - margin.top - margin.bottom;
  }
  calculatePresentedDatasets() {
    this.presentedDatasets = this._datasets.filter(dataset => dataset.isEnabled);
  }
  calculateDatasetStacks() {
    let datasetRef = this.presentedDatasets;
    let datasetsPerYearRef = this.presentedDatasetsPerYear;
    this.datasetStacks = this.listOfStacks.map(function (stackName, index) {
      let stackCandidates = datasetRef.filter(dataset => dataset.stack === stackName);
      let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
      let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);
      let stack = d3.stack()
        .keys(candidatesNames)
        (datasetsPerYearRef);
      stack.label = stackName;
      stack.stack = stackName;
      stack.colors = candidatesColors;
      return stack;
    });
    this.allDatasetStacks = this.listOfAllStacks.map(function (stackName) {
      let stackCandidates = this._datasets.filter(dataset => dataset.stack === stackName);
      let candidatesNames = stackCandidates.map(stackCandidate => stackCandidate.label);
      let candidatesColors = stackCandidates.map(stackCandidate => stackCandidate.color);
      let stack = d3.stack()
        .keys(candidatesNames)
        (this.datasetsPerYear);
      stack.label = stackName;
      stack.stack = stackName;
      stack.colors = candidatesColors;
      return stack;
    }.bind(this));
  }
  calculateListOfStacks() {
    let temporaryMap = d3.map(this.presentedDatasets, dataset => dataset.stack || dataset.label);
    this.listOfStacks = Array.from(new Set(temporaryMap));
    let temporaryMap2 = d3.map(this._datasets, dataset => dataset.stack || dataset.label);
    this.listOfAllStacks = Array.from(new Set(temporaryMap2));
  }
  calculateListOfYears() {
    if (this.presentedDatasets.length > 0) {
      this.listOfYears = this.presentedDatasets[0].data.map(item => item.year);
    } else {
      this.listOfYears = [];
    }
  }
  calculateListOfDatasetNames() {
    this.listOfDatasetNames = this.presentedDatasets.map(dataset => dataset.label);
  }
  calculateDatasetsPerYear() {
    let flattenData = this.flattenData;
    this.datasetsPerYear = this.listOfYears.map(function (year) {
      let yearSet = {year: year};
      flattenData
        .filter(item => item.year === year)
        .forEach(function (entry) {
          yearSet[entry.label] = entry.value;
          yearSet.total = entry.yearTotal;
        });
      return yearSet;
    });
    this.presentedDatasetsPerYear = this.listOfYears.map(function (year) {
      let yearSet = {year: year};
      flattenData
        .filter(item => item.year === year)
        .filter(item => item.isEnabled === true)
        .forEach(function (entry) {
          yearSet[entry.label] = entry.value;
          yearSet.total = entry.yearTotal;
        });
      return yearSet;
    });
  }
  calculateFlattenData() {
    this.flattenData = this._datasets.map(function (dataset) {
      dataset.data.forEach(function (item) {
        item.label = dataset.label;
        item.stack = dataset.stack;
        item.key = dataset.stack;
        item.isEnabled = dataset.isEnabled;
      });
      return dataset.data;
    }).flat(1);
  }
  calculateColors() {
    for (let index = 0; index < this.listOfAllStacks.length; index++) {
      let stackName = this.listOfAllStacks[index];
      let datasets = this._datasets.filter(dataset => dataset.stack === stackName);
      let numberOfDatasets = datasets.length;
      let colors = colorsForStack(index, numberOfDatasets);
      for (let index = 0; index < colors.length; index++) {
        datasets[index].color = colors[index];
      }
    }
  }
  afterDrawChart() {
  }
  removeSVG() {
    this.element
      .selectAll('svg')
      .remove();
  }
  createSVG() {
    this.removeSVG();
    this.svg = this.element
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr('id', DiachronicChart.svgID);
    new Image;
  }
  createGraph() {
    this.graph = this.svg
      .append('g')
      .attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }
  createScales() {
    let max = d3.max(this.allDatasetStacks, function (stack) {
      return d3.max(stack, function (serie) {
        let values = serie.map(item => item['1']);
        return d3.max(values);
      });
    });
    this.max = max;
    console.log('this.max: ' + this.max);
    this.xChart = d3.scaleBand()
      .domain(this.listOfYears)
      .rangeRound([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.1);
    this.xDataset = d3.scaleBand()
      .domain(this.listOfDatasetNames)
      .rangeRound([0, this.xChart.bandwidth()])
      .padding(0.05);
    this.xStack = d3.scaleBand()
      .domain(this.listOfStacks)
      .rangeRound([0, this.xChart.bandwidth()])
      .padding(0.05);
    this.yChart = d3.scaleLinear()
      .domain([0, max]).nice()
      .rangeRound([this.height - this.margin.bottom, this.margin.top]);
  }
  createAxis() {
    this.xAxisGrid = d3
      .axisBottom(this.xChart)
      .tickSize(-this.graphHeight)
      .tickFormat('');
    this.yAxisGrid = d3
      .axisLeft(this.yChart)
      .tickSize(-this.graphWidth)
      .tickFormat('')
      .ticks(20);
  }
  renderAxis() {
    this.svg
      .append("g")
      .call(d3.axisBottom(this.xChart))
      .attr("transform", dataset => `translate(0,${this.height - this.margin.bottom})`);
    this.svg
      .append("g")
      .call(d3.axisLeft(this.yChart))
      .attr("transform", dataset => `translate(${this.margin.left},0)`);
  }
  renderGrid() {
    this.svg
      .append('g')
      .attr('class', 'x axis-grid')
      .attr('transform', 'translate(0,' + (this.height - this.margin.bottom) + ')')
      .attr('stroke', 'lightgray')
      .attr('stroke-width', '0.5')
      .attr("opacity", 0.3)
      .call(this.xAxisGrid);
    this.svg
      .append('g')
      .attr('class', 'y axis-grid')
      .attr('transform', `translate(${this.margin.left},0)`)
      .attr('stroke', 'lightgray')
      .attr('stroke-width', '0.5')
      .attr("opacity", 0.3)
      .call(this.yAxisGrid);
  }
  renderStacks() {
    for (let index = 0; index < this.datasetStacks.length; index++) {
      this.renderBars(this.datasetStacks[index], index);
    }
    if (this.isShowLabels === false) return;
    for (let index = 0; index < this.datasetStacks.length; index++) {
      this.renderBarLabels(this.datasetStacks[index], index);
    }
  }
  renderBars(stack, index) {
    let xChartRef = this.xChart;
    let yChartRef = this.yChart;
    let xStackRef = this.xStack;
    this.svg.append("g")
      .selectAll("g")
      .data(stack)
      .enter()
      .append("g")
      .attr("fill", function (dataset, index) {
        if (this.isCombineStacks) {
          return stack.colors[0].rgbString();
        } else {
          return stack.colors[index].rgbString();
        }
      }.bind(this))
      .selectAll("rect")
      .data(function (data) {
        return data;
      })
      .enter()
      .append("rect")
      .attr("rx", function () {
        return this.isCombineStacks ? 0 : 4;
      }.bind(this))
      .attr("x", function (d) {
        return xChartRef(d.data.year) + xStackRef(stack.label);
      })
      .attr("y", function (d) {
        return yChartRef(d[1]);
      })
      .attr("height", function (d) {
        return yChartRef(d[0]) - yChartRef(d[1]);
      })
      .attr("width", xStackRef.bandwidth());
  }
  renderBarLabels(stack, index) {
    let xChartRef = this.xChart;
    let yChartRef = this.yChart;
    let xStackRef = this.xStack;
    let numberFormat = this.numberFormat;
    let labelColor = this.labelColor;
    let numberOfSeries = stack.length;
    let serieIndex = 0;
    this.svg.append("g")
      .selectAll('g')
      .data(stack)
      .enter()
      .append('g')
      .attr('fill', labelColor)
      .selectAll('.text')
      .data(function (dataset) {
        return dataset;
      })
      .enter()
      .append('text')
      .attr("transform", function (item) {
        let x = xChartRef(item.data.year) + xStackRef(stack.label) + (xStackRef.bandwidth() / 2);
        let y = yChartRef(item[1]) - 5;
        return `translate(${x},${y})rotate(-60)`;
      })
      .attr("font-size", 13)
      .text(function (item, index) {
        if (index === 0) serieIndex += 1;
        if (serieIndex !== numberOfSeries) return;
        let value = item[1];
        return value === 0 ? '' : numberFormat.format(value);
      });
  }
  createLine() {
    if (this.datasetGroups.length === 0) {
      return debug('no datasets given to render lines.');
    }
    for (let i = 0; i < this.presentedDatasetGroups.length; i++) {
      let dataset = this.presentedDatasetGroups[i];
      let color = colorsForStack(i, 1)[0];
      dataset.color = color;
      this.renderLine(dataset);
    }
  }
  renderLine(dataset, index) {
    this.graph
      .append("path")
      .datum(dataset.data)
      .attr("fill", "none")
      .attr("stroke", dataset.color.rgbString())
      .attr("stroke-width", 3.5)
      .attr("d", d3.line()
        .x((item) => this.x0(item.year))
        .y((item) => this.y0(item.value))
        .curve(d3.curveMonotoneX));
    let dots = this.graph
      .selectAll(".dot")
      .data(dataset.data.filter((item) => item.value > 0))
      .enter()
      .append("circle")
      .attr("r", 6)
      .attr("cx", (item) => this.x0(item.year))
      .attr("cy", (item) => this.y0(item.value))
      .attr("fill", dataset.color.rgbString());
    let tooltip = this.element
      .append("div")
      .attr("class", "toolTip")
      .style('z-index', '9999');
    dots
      .on("mousemove", function (event, item) {
        let text = "<b>" + item.searchText + "</b>"
          + " in "
          + "<b>" + item.year + "</b>"
          + "<br>Abs.: <b>" + item.value + "</b>"
          + "<br>Rel.: <b>" + item.relativeValue + "</b>"
          + "<br>Total Year: <b>" + item.yearTotal + "</b>";
        tooltip
          .style("left", event.pageX - 20 + "px")
          .style("top", event.pageY - 160 + "px")
          .style("padding", "10px")
          .style("background", "none repeat scroll 0 0 #ffffff")
          .style("position", "absolute")
          .style("border", "1px solid " + dataset.color.rgbString())
          .style("display", "inline-block")
          .html(text);
      })
      .on("mouseout", function (d) {
        tooltip.style("display", "none");
      });
    if (this.isShowLabels === true) {
      this.renderLineLabels(dataset);
    }
  }
  renderLineLabels(dataset) {
    this.graph
      .selectAll(".text")
      .data(dataset.data.filter((item) => item.value > 0))
      .enter()
      .append('text')
      .attr("x", (item) => this.x0(item.year))
      .attr("y", (item) => this.y0(item.value))
      .attr('dy', '-10')
      .attr('text-anchor', 'middle')
      .attr("font-size", 15)
      .attr('fill', 'gray')
      .text((item) => this.numberFormat.format(item.value || 0));
  }
  renderLegend() {
    if (this.isCombineStacks) {
      this.renderCombinedStacksLegend();
    } else {
      this.renderNormalLegend();
    }
  }
  renderNormalLegend() {
    let datasets = this._datasets;
    let datasetNames = datasets.map(dataset => dataset.label);
    let circleRadius = 6;
    let labelMargin = 50;
    let xLegend = d3.scaleBand()
      .domain(datasetNames)
      .rangeRound([this.margin.left, this.width - this.margin.right]);
    let legends = this.graph
      .selectAll('.legend')
      .data(datasets)
      .enter();
    let legendsTexts = legends
      .append('text')
      .attr("font-size", 13)
      .attr("x", function (item) {
        return xLegend(item.label) - 30;
      })
      .attr("y", function (item) {
        return this.graphHeight + labelMargin;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("fill", function (item, index) {
        return item.color.rgbString();
      }.bind(this))
      .text(function (item) {
        return `${item.label} (${this.getSumForWord(item.label)})`;
      }.bind(this));
    legends
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", function (item) {
        return xLegend(item.label) - (circleRadius * 2) - 30;
      }.bind(this))
      .attr("cy", function (item) {
        return this.graphHeight + labelMargin - circleRadius + 2;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("stroke", function (item) {
        return item.color.rgbString();
      }.bind(this))
      .style("fill", function (item) {
        return item.isEnabled ? item.color.rgbString() : 'white';
      }.bind(this))
      .style("stroke-width", 2);
    legendsTexts.on('click', function (event) {
      if (!event || !event.target) return;
      if (!event.target.innerHTML) return;
      let label = event.target.innerHTML.split(' ')[0];
      this.toggleDataset(label);
    }.bind(this));
  }
  renderCombinedStacksLegend() {
    let stackNames = this.listOfAllStacks;
    console.log('stackNames: ' + stackNames);
    let circleRadius = 6;
    let labelMargin = 50;
    let xLegend = d3.scaleBand()
      .domain(stackNames)
      .rangeRound([this.margin.left, this.width - this.margin.right]);
    let legends = this.graph
      .selectAll('.legend')
      .data(stackNames)
      .enter();
    legends
      .append('text')
      .attr("font-size", 13)
      .attr("x", function (item) {
        return xLegend(item) - 30;
      })
      .attr("y", function (item) {
        return this.graphHeight + labelMargin;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("fill", function (item, index) {
        return colorsForStack(index, 1)[0].rgbString();
      }.bind(this))
      .text(function (item) {
        return `${item} (${this.getSumForStack(item)})`;
      }.bind(this));
    legends
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", function (item) {
        return xLegend(item) - (circleRadius * 2) - 30;
      }.bind(this))
      .attr("cy", function (item) {
        return this.graphHeight + labelMargin - circleRadius + 2;
      }.bind(this))
      .style('cursor', 'pointer')
      .style("stroke", function (item, index) {
        return colorsForStack(index, 1)[0].rgbString();
      }.bind(this))
      .style("fill", function (item, index) {
        let color = colorsForStack(index, 1)[0];
        return item.isEnabled ? color.rgbString() : 'white';
      }.bind(this))
      .style("stroke-width", 2);
  }
  toggleDataset(label) {
    let dataset = this._datasets.find(dataset => dataset.label === label);
    dataset.isEnabled = !dataset.isEnabled;
    this.update();
  }
  getSumForWord(word) {
    let values = this.flattenData
      .filter(item => item.label === word)
      .map(item => item.value);
    return this.numberFormat.format(d3.sum(values));
  }
  getSumForStack(stackName) {
    let values = this.flattenData
      .filter(item => item.stack === stackName)
      .map(item => item.value);
    return d3.sum(values);
  }
}
DiachronicChart.svgID = 'chart-svg';
DiachronicChart.ChartType = {
  Bar: 'Bar',
  Line: 'Line'
};

class DiachronicChartSettingsPopup extends Popup {
  render() {
    this.card
      .headerRow
      .append('h3')
      .text(Language.translate('Settings'));
    this.row = this.card.body
      .append('div')
      .classed('row', true);
    this.renderShowLabelsCheckbox();
    this.renderCombineStacksCheckbox();
    this.renderRadios();
  }
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText(Language.translate('Labels'));
    this.showLabelsCheckbox.onClick = function (checked) {
      this.diachronicChart.isShowLabels = checked;
      this.diachronicChart.update();
      URLParameters.getInstance().set(URLParameters.chartShowLabels, checked);
    }.bind(this);
  }
  renderCombineStacksCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText(Language.translate('Combine Stacks'));
    this.combineStacksCheckbox.onClick = function (checked) {
      this.diachronicChart.isCombineStacks = checked;
      this.diachronicChart.update();
      URLParameters.getInstance().set(URLParameters.chartCombineStacks, checked);
    }.bind(this);
  }
  renderRadios() {
    let container = this.row.append('div').classed('col-12', true);
    this.typeRadioGroup = new RadioGroup(container);
    this.typeRadioGroup.setOptions([
      new Option('bar', 'Bar'),
      new Option('line', 'Line')
    ]);
    this.typeRadioGroup.onChange = function (value) {
      this.diachronicChart.type = value;
      this.diachronicChart.update();
      URLParameters.getInstance().set(URLParameters.chartType, value);
    }.bind(this);
  }
  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }
  willShow() {
    this.loadValues();
  }
  loadValues() {
    this.showLabelsCheckbox.setChecked(this.diachronicChart.isShowLabels);
    console.log('this.diachronicChart.showLabels: ' + this.diachronicChart.isShowLabels);
    this.combineStacksCheckbox.setChecked(this.diachronicChart.isCombineStacks);
    console.log('this.diachronicChart.combineGroups: ' + this.diachronicChart.isCombineStacks);
    this.typeRadioGroup.setSelectedOption(this.diachronicChart.type);
  }
}

function screenshotElement(selector, name) {
    console.log('selector: ' + selector);
    let element = document.querySelector(selector);
    console.log('element: ' + element);
    html2canvas(element).then(canvas => {
        const link = document.createElement("a");
        link.setAttribute('download', name || "name");
        link.href = canvas.toDataURL("image/jpg");
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}

class DiachronicChartCard extends Card {
  constructor(selector, name) {
    super(selector);
    if (!selector) {
      throw 'No selector specified.';
    }
    this.selector = selector;
    this.name = selector;
    this.renderChart();
    this.renderScreenshotButton();
    this.renderMoreActionsButton();
    this.applyURLParameters();
  }
  renderChart() {
    this.chart = new DiachronicChart(this.body);
    this.chart.margin.left = 150;
    this.chart.margin.right = 150;
  }
  renderScreenshotButton() {
    this.chartID = createUUID();
    this.body.attr('id', this.chartID);
    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.element.html('<i class="fas fa-camera"></i>');
    this.screenshotButton.onClick = function (event) {
      let name = 'my_image.jpg';
      let chartID = this.chartID;
      screenshotElement("#" + chartID, name);
    }.bind(this);
  }
  renderMoreActionsButton() {
    this.moreActionButton = new Button(this.headerRightComponent);
    this.moreActionButton.setText('More');
    this.moreActionButton.element.classed('simple-button', true);
    this.moreActionButton.element.html('<i class="fas fa-ellipsis-h"></i>');
    this.moreActionButton.onClick = function (event) {
      if (!event || !event.target) return;
      this.presentSettingsPopup();
    }.bind(this);
  }
  applyURLParameters() {
    this.chart.type = URLParameters.getInstance()
      .getString(URLParameters.chartType, 'bar');
    this.chart.isShowLabels = URLParameters.getInstance()
      .getBoolean(URLParameters.chartShowLabels, false);
    this.chart.isCombineStacks = URLParameters.getInstance()
      .getBoolean(URLParameters.chartCombineStacks, false);
  }
  presentSettingsPopup() {
    let application = window.frcvApp;
    let button = document.getElementById(this.moreActionButton.selector);
    let settingsPopup = new DiachronicChartSettingsPopup(application.element);
    settingsPopup.diachronicChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }
}

const RecentSearchesLocalStorageKey = 'de.beuth.frc-visualization.RecentSearchesLocalStorageKey';
const MaxItemsCount = 100;
class RecentSearches {
  constructor() {
    this.loadFromLocalStorage();
  }
  static getInstance() {
    if (!RecentSearches.instance) {
      RecentSearches.instance = new RecentSearches();
    }
    return RecentSearches.instance;
  }
  append(searchText) {
    this.removeIfExisting(searchText);
    this.insert(searchText);
    this.storeToLocalStorage();
  }
  insert(value) {
    this.values.splice(0, 0, value);
    this.removeDispensableValues();
  }
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

class SearchField extends Component {
    constructor(parent) {
        super(parent);
        if (!parent) {
            throw 'No parent specified.';
        }
        this.parent = parent;
        this.datalistId = createUUID();
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
    }
    startSearch(searchText) {
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

class Dropdown extends Component {
    constructor(parent) {
        super(parent);
        this.inputElements = [];
        this.selector = createUUID();
        this.element = parent
            .append('div')
            .classed('dropdown-container', true);
        this.selectId = createUUID();
        this.renderLabel();
        this.renderSelect();
    }
    renderLabel() {
        this.label = this.element
            .append('label')
            .attr('for', this.selectId);
    }
    renderSelect() {
        let thisReference = this;
        this.select = this.element
            .append('select')
            .classed('form-control form-control-sm', true)
            .attr('id', this.selectId)
            .on('change', function (event) {
                thisReference.onClick(event);
            });
    }
    addOption(optionId, optionName) {
        return this.select
            .append('option')
            .attr('id', optionId)
            .attr('value', optionId)
            .text(optionName);
    }
    setOptions(options) {
        this.removeAllInputs();
        for (let i = 0; i < options.length; i++) {
            let id = options[i][0] || options[i].id;
            let name = options[i][1] || options[i].translatedTitle;
            let inputElement = this.addOption(id, name);
            this.inputElements.push(inputElement);
        }
        return this;
    }
    removeAllInputs() {
        this.element.selectAll('input').remove();
        return this;
    }
    onClick(event) {
        let element = event.target;
        if (!element) {
            return;
        }
        let value = element.value;
        if (!this.onChange) {
            return;
        }
        this.onChange(value);
        return this;
    }
    onChange(argument) {
        console.log('argument: ' + argument);
        if (typeof argument !== 'string') {
            this.onChange = argument;
        }
        return this;
    }
    setLabelText(text) {
        this.label.text(text);
        return this;
    }
    setOnChange(callback) {
        this.onChange = callback;
        return this;
    }
    setSelectedOption(optionID) {
        if (this.inputElements.find(function (item) {
            return item.attr('value') === optionID;
        }) !== undefined) {
            this.value = optionID;
        }
        return this;
    }
    set value(optionID) {
        document.getElementById(this.selectId).value = optionID;
    }
    get value() {
        return document.getElementById(this.selectId).value;
    }
}

class LoadingView extends Component {
    constructor(parent) {
        super(parent);
        this.render();
    }
    render() {
        this.container = this.parent
            .append('div')
            .classed('loading-container', true);
        this.card = this.container
            .append('div')
            .classed('loading-card', true)
            .text(Language.translate('Loading...'));
    }
    show() {
        this.container.style('display', 'block');
    }
    hide() {
        this.container.style('display', 'none');
    }
    remove() {
        this.container.remove();
    }
}

class InnovationListPopup extends Popup {
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
    willShow() {
        super.willShow();
        this.loadingView = new LoadingView(this.row);
        d3.text('/assets/InnovationList.txt')
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

class SearchCard extends Card {
  constructor(parent) {
    super(parent);
    this.header.style('display', 'none');
    this.row = this.body
      .append('div')
      .classed('row margin-top', true);
    this.renderSearchField();
    this.renderCaseSensitiveDropdown();
    this.renderRangeDropdown();
    this.renderRelativeAbsolute();
    this.renderFooterRow();
    this.renderPresentInnovationListPopupButton();
    this.renderSearchButton();
  }
  renderSearchField() {
    this.searchFieldContainer = this.row
      .append('div')
      .classed('col-4', true);
    this.searchField = new SearchField(this.searchFieldContainer);
    this.searchField.onEnter = function () {
      this.startSearching();
    }.bind(this);
  }
  renderCaseSensitiveDropdown() {
    this.caseSensetiveGroupContainer = this.row
      .append('div')
      .classed('col-2', true);
    this.sensitivityDropdown = new Dropdown(this.caseSensetiveGroupContainer)
      .setOptions([
        new Option('case-sensitive', 'Case Sensitive'),
        new Option('case-insensitive', 'Case Insensitive'),
      ]);
    this.sensitivityDropdown.label.text('Sensitivity');
    this.sensitivityDropdown.onChange = function (value) {
      URLParameters.getInstance().set(URLParameters.searchSensitivity, value);
      this.startSearching();
    }.bind(this);
  }
  renderRangeDropdown() {
    let startYear = 1995;
    let endYear = 2020;
    let defaultStartYear = 2000;
    let options = [];
    for (let year = startYear; year <= endYear; year++) {
      options.push([year, year]);
    }
    this.yearStartContainer = this.row.append('div').classed('col-2', true);
    this.yearStartDropdown = new Dropdown(this.yearStartContainer)
      .setLabelText(Language.translate('from'))
      .setOptions(options)
      .setSelectedOption(defaultStartYear)
      .setOnChange(function (startYear) {
        URLParameters.getInstance().set(URLParameters.startYear, startYear);
        this.startSearching();
      }.bind(this));
    this.yearEndContainer = this.row.append('div').classed('col-2', true);
    this.yearEndDropdown = new Dropdown(this.yearEndContainer)
      .setLabelText(Language.translate('till'))
      .setOptions(options)
      .setSelectedOption(endYear)
      .setOnChange(function (endYear) {
        URLParameters.getInstance().set(URLParameters.endYear, endYear);
        this.startSearching();
      }.bind(this));
  }
  renderRelativeAbsolute() {
    let container2 = this.row
      .append('div')
      .classed('col-2', true);
    this.valueRadioGroup = new RadioGroup(container2);
    this.valueRadioGroup.setOptions([
      new Option('relative', 'Relative'),
      new Option('absolute', 'Absolute')
    ]);
    this.valueRadioGroup.onChange = function (value) {
      this.diachronicChart.valueType = value;
      this.diachronicChart.update();
      this.valueType = value;
      URLParameters.getInstance().set(URLParameters.valueType, value);
      this.startSearching();
    }.bind(this);
  }
  renderFooterRow() {
    this.footer = this.row
      .append('div')
      .classed('col-12 button-group margin-top text-end', true);
  }
  renderPresentInnovationListPopupButton() {
    this.presentInnovationListPopupButton = new Button(this.footer);
    this.presentInnovationListPopupButton.element.classed('button-down', true);
    this.presentInnovationListPopupButton.setText(Language.translate('Innovation List'));
    this.presentInnovationListPopupButton.onClick = function (event) {
      if (!event || !event.target) return;
      let application = Application.default;
      let popup = new InnovationListPopup(application.element);
      popup.searchCard = this;
      popup.showUnder(event.target, 'center');
    }.bind(this);
  }
  renderSearchButton() {
    this.searchButton = new Button(this.footer);
    this.searchButton.element.classed('button round-button', true);
    this.searchButton.setText(Language.translate('Search'));
    this.searchButton.onClick = function () {
      this.startSearching();
    }.bind(this);
  }
  getSearchText() {
    return this.searchField.getText();
  }
  startSearching() {
  }
  createFooter() {
  }
  get searchText() {
    return this.searchField.getText();
  }
  get sensitivity() {
    return this.sensitivityDropdown.value;
  }
  get firstYear() {
    return this.yearStartDropdown.value;
  }
  get lastYear() {
    return this.yearEndDropdown.value;
  }
}

class GeoJson {
    constructor(source) {
        this.type = source.type;
        this.features = [];
        for (let index = 0; index < source.features.length; index++) {
            let featureSource = source.features[index];
            let feature = new Feature(featureSource);
            this.features.push(feature);
        }
    }
    getCenter() {
        let allCoordinates = this.extractAllCoordinates();
        console.log('allCoordinates.length: ' + allCoordinates.length);
        let latitudeSum = 0;
        let longitudeSum = 0;
        allCoordinates.forEach(function (coordinates) {
            latitudeSum += coordinates[1];
            longitudeSum += coordinates[0];
        });
        return [
            latitudeSum / allCoordinates.length,
            longitudeSum / allCoordinates.length
        ];
    }
    extractGeometryCollection() {
        let geometryCollection = [];
        if (this.type === 'Feature') {
            geometryCollection.push(this.geometry);
        } else if (this.type === 'FeatureCollection') {
            this.features.forEach(feature => geometryCollection.push(feature.geometry));
        } else if (this.type === 'GeometryCollection') {
            this.geometries.forEach(geometry => geometryCollection.push(geometry));
        } else {
            throw new Error('The geoJSON is not valid.');
        }
        return geometryCollection;
    }
    extractAllCoordinates() {
        let geometryCollection = this.extractGeometryCollection();
        let coordinatesCollection = [];
        geometryCollection.forEach(item => {
            let coordinates = item.coordinates;
            let type = item.type;
            if (type === 'Point') {
                console.log("Point: " + coordinates.length);
                coordinatesCollection.push(coordinates);
            } else if (type === 'MultiPoint') {
                console.log("MultiPoint: " + coordinates.length);
                coordinates.forEach(coordinate => coordinatesCollection.push(coordinate));
            } else if (type === 'LineString') {
                console.log("LineString: " + coordinates.length);
                coordinates.forEach(coordinate => coordinatesCollection.push(coordinate));
            } else if (type === 'Polygon') {
                coordinates.forEach(function (polygonCoordinates) {
                    polygonCoordinates.forEach(function (coordinate) {
                        coordinatesCollection.push(coordinate);
                    });
                });
            } else if (type === 'MultiLineString') {
                coordinates.forEach(function (featureCoordinates) {
                    featureCoordinates.forEach(function (polygonCoordinates) {
                        polygonCoordinates.forEach(function (coordinate) {
                            coordinatesCollection.push(coordinate);
                        });
                    });
                });
            } else if (type === 'MultiPolygon') {
                coordinates.forEach(function (featureCoordinates) {
                    featureCoordinates.forEach(function (polygonCoordinates) {
                        polygonCoordinates.forEach(function (coordinate) {
                            coordinatesCollection.push(coordinate);
                        });
                    });
                });
            } else {
                throw new Error('The geoJSON is not valid.');
            }
        });
        return coordinatesCollection;
    }
}
class Feature {
    constructor(source) {
        this.type = source.type;
        this.properties = source.properties;
        this.geometry = new Geometry(source.geometry);
    }
}
class Geometry {
    constructor(source) {
        this.type = source.type;
        this.coordinates = source.coordinates;
    }
}

function flattenDatasets(datasets) {
    let flattenList = [];
    for (let index = 0; index < datasets.length; index++) {
        let dataset = datasets[index];
        let dataCollection = dataset.data;
        dataCollection.forEach(item => {
            item.dataset = dataset.dlabel;
            item.stack = dataset.stack;
            flattenList.push(item);
        });
    }
    return flattenList;
}
function combine(flattenList) {
    let combined = [];
    for (let index = 0; index < flattenList.length; index++) {
        let listItem = flattenList[index];
        let entry = combined.find(function (entryItem) {
            return entryItem.stack === listItem.stack
                && entryItem.dlabel === listItem.dlabel;
        });
        if (entry) {
            entry.value += listItem.value;
        } else {
            combined.push({
                dlabel: listItem.dlabel,
                stack: listItem.stack,
                value: listItem.value
            });
        }
    }
    return combined;
}
function combineDataByLabel(flattenList) {
    let combined = [];
    for (let index = 0; index < flattenList.length; index++) {
        let listItem = flattenList[index];
        let entry = combined.find(function (entryItem) {
            return entryItem.dlabel === listItem.dlabel;
        });
        if (entry) {
            entry.value += listItem.value;
        } else {
            combined.push({
                dlabel: listItem.dlabel,
                stack: listItem.stack,
                value: listItem.value
            });
        }
    }
    return combined;
}

class MapChart extends Component {
  constructor(parent) {
    super(parent);
    this.element = parent
      .append('div')
      .attr('id', this.selector);
    this.initialize();
    this.initializeProjection();
    this.initializePath();
    this.renderSVG();
    this.renderMapBackground();
    this.renderTooltipContainer();
    this.renderLegend();
  }
  initialize() {
    this.width = 1000;
    this.height = 1000;
    this.tintColor = 'blue';
    this.backgroundColor = 'gray';
    this.backgroundOpacity = 0.2;
    this.isDrawsBackground = true;
    this.isZoomable = true;
    this.isShowLabels = true;
    this.datasets = [];
    this.geoJSON = null;
    this.departmentsData = [];
    this.excludedFeatureCodes = [
      '2A', '2B'
    ];
  }
  initializeProjection() {
    this.projection = d3.geoMercator();
  }
  initializePath() {
    this.path = d3.geoPath().projection(this.projection);
  }
  renderSVG() {
    this.svg = d3
      .select(`#${this.selector}`)
      .append('svg')
      .attr('id', 'map')
      .classed('map', true)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
  }
  renderMapBackground() {
    this.background = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', this.backgroundColor)
      .attr('fill-opacity', function () {
        return this.isDrawsBackground ? this.backgroundOpacity : 0;
      }.bind(this));
  }
  renderTooltipContainer() {
    let color = this.tintColor;
    this.tooltip = this.element
      .append('div')
      .attr('class', 'map-tooltip')
      .attr('rx', 5)
      .attr('ry', 5)
      .style('position', 'absolute')
      .style('color', 'black')
      .style('border', function () {
        return `solid 1px ${color}`;
      })
      .style('opacity', 0);
    this.bounds = this.svg
      .append('rect')
      .attr('class', 'bounds')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('fill-opacity', 0)
      .style('stroke', 'red')
      .style('stroke-width', '0.7px')
      .style('stroke-dasharray', '1,1');
  }
  renderLegend() {
    this.legend = this.svg
      .append('svg')
      .attr('class', 'legend')
      .attr('fill', 'red')
      .attr('width', this.width)
      .attr('height', 200)
      .attr('x', 0)
      .attr('y', 0);
  }
  renderGeoJson() {
    let geoJSON = this.geoJSON;
    let projection = this.projection;
    geoJSON.features.forEach(function (feature) {
      feature.center = d3.geoCentroid(feature);
      let code = feature.properties.code;
      if (!this.departmentsData || !this.departmentsData.length) return;
      feature.departmentsData = this.departmentsData.find(dataset => +dataset.departmentNumber === +code);
    }.bind(this));
    d3.max(this.departmentsData, data => data.value);
    let tooltip = this.tooltip;
    let boundsRectangle = this.bounds;
    String(this.tooltip.style('width') || 210).replace('px', '');
    let tintColor = this.tintColor;
    let thisReference = this;
    this.svg
      .selectAll('path')
      .data(geoJSON.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('id', feature => feature.properties.code)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'black')
      .attr('stroke-width', '0.7')
      .attr('stroke-dasharray', function (feature) {
        return feature.departmentsData ? '0' : '1,4';
      }.bind(this))
      .attr('cursor', 'pointer')
      .on('click', function (event, feature) {
      }.bind(this))
      .on('mouseenter', function (event, feature) {
        d3.select(this)
          .attr('stroke', () => tintColor)
          .attr('stroke-width', '2')
          .attr('stroke-dasharray', '0');
        let properties = feature.properties;
        if (!properties) return;
        let code = properties.code;
        let propertiesSelection = Object.keys(properties);
        let components = propertiesSelection.map(function (propertyName) {
          return `${propertyName.capitalize()}: ${properties[propertyName]}`;
        });
        let flatData = flattenDatasets(thisReference.datasets);
        let data = flatData.filter(item => +item.dlabel === +code);
        if (data) {
          for (let index = 0; index < data.length; index++) {
            let item = data[index];
            components.push(item.datasetName + ': ' + item.value);
          }
        }
        tooltip.html(components.join('<br>'));
        let tooltipWidth = Number(tooltip.style('width').replace('px', '') || 200);
        let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
        tooltipWidth += 20;
        tooltipHeight += 20;
        let featureBounds = d3.geoBounds(feature);
        let featureLowerLeft = projection(featureBounds[0]);
        let featureUpperRight = projection(featureBounds[1]);
        let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
        let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];
        let effectiveSize = thisReference.getElementEffectiveSize();
        let widthFactor = effectiveSize[0] / thisReference.width;
        let heightFactor = effectiveSize[1] / thisReference.height;
        let positionOffset = thisReference.getElementPosition();
        let top = 0;
        if ((featureLowerLeft[1] * heightFactor) > (effectiveSize[1] / 2)) {
          top = featureUpperRight[1];
          top *= widthFactor;
          top -= tooltipHeight;
          top -= 5;
        } else {
          top = featureLowerLeft[1];
          top *= widthFactor;
          top += 5;
        }
        top += positionOffset[1];
        let centerBottom = featureLowerLeft[0];
        centerBottom += (featureBoundsWidth / 2);
        centerBottom *= widthFactor;
        centerBottom -= (Number(tooltipWidth) / 2);
        centerBottom += positionOffset[0];
        tooltip.style('opacity', 1)
          .style('left', centerBottom + 'px')
          .style('top', top + 'px');
        boundsRectangle
          .style('opacity', 1)
          .style('width', featureBoundsWidth + 'px')
          .style('height', featureBoundsHeight + 'px')
          .style('x', featureLowerLeft[0])
          .style('y', featureUpperRight[1]);
      })
      .on('mouseout', function (event, feature) {
        d3.select(this)
          .attr('stroke', 'black')
          .attr('stroke-width', '0.7')
          .attr('stroke-dasharray', function (feature) {
            return feature.departmentsData ? '0' : '1,4';
          });
        tooltip.style('opacity', 0);
        boundsRectangle.style('opacity', 0);
      });
  }
  renderDatasets() {
    if (!this.geoJSON) return;
    if (!this.datasets) return;
    let stackNames = this.getStackNames();
    let flatData = flattenDatasets(this.datasets);
    let combinedData = combineDataByLabel(flatData);
    colorsForStack(0, 1)[0];
    this.svg
      .selectAll('path')
      .attr('fill', 'white')
      .attr('fill-opacity', '.5');
    for (let index = 0; index < stackNames.length; index++) {
      let stackName = stackNames[index];
      let dataForStack = combinedData.filter(data => data.stack === stackName);
      let max = d3.max(dataForStack, item => item.value);
      let color = colorsForStack(index, 1)[0];
      for (let index = 0; index < dataForStack.length; index++) {
        let datasetEntry = dataForStack[index];
        let id = +datasetEntry.dlabel;
        this.svg
          .selectAll('path')
          .filter(item => +item.properties.code === id)
          .attr('fill', color.rgbString())
          .attr('fill-opacity', datasetEntry.value / max);
      }
    }
  }
  renderDatasetLabels() {
    if (!this.geoJSON) return;
    if (!this.datasets) return;
    let geoJSON = this.geoJSON;
    let datasetsFlatten = flattenDatasets(this.datasets);
    let combinedData = combineDataByLabel(datasetsFlatten);
    this.svg.selectAll('.map-label').remove();
    this.svg
      .selectAll('text')
      .data(geoJSON.features)
      .enter()
      .append('text')
      .attr('class', 'map-label')
      .attr('text-anchor', 'middle')
      .attr('fill', this.tintColor)
      .attr('font-size', 12)
      .attr('opacity', function () {
        return this.isShowLabels ? 1 : 0;
      }.bind(this))
      .text(function (feature) {
        let code = +feature.properties.code;
        let dataset = combinedData.find(dataset => +dataset.dlabel === code);
        return dataset ? dataset.value : '';
      })
      .attr('x', function (feature) {
        return this.projection(feature.center)[0];
      }.bind(this))
      .attr('y', function (feature) {
        return this.projection(feature.center)[1];
      }.bind(this));
  }
  renderDatasetsLegend() {
    if (!this.datasets) return;
    let stackNames = this.getStackNames();
    let flatData = flattenDatasets(this.datasets);
    let combinedData = combine(flatData);
    this.legend.raise();
    this.legend.selectAll('rect').remove();
    this.legend.selectAll('text').remove();
    for (let index = 0; index < stackNames.length; index++) {
      let stackName = stackNames[index];
      let dataForStack = combinedData.filter(data => data.stack === stackName);
      let max = d3.max(dataForStack, item => item.value);
      let offset = index * 80;
      let color = colorsForStack(index, 1)[0];
      let steps = 4;
      let data = [0, 1, 2, 3, 4];
      this.legend
        .append('text')
        .attr('x', offset + 20)
        .attr('y', '14')
        .style('fill', color.rgbString())
        .text(stackName);
      this.legend
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .style('fill', color.rgbString())
        .attr('x', '20')
        .attr('y', '20')
        .attr('width', 18)
        .attr('height', 18)
        .attr('transform', function (d, i) {
          return 'translate(' + offset + ',' + (i * 20) + ')';
        })
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill-opacity', (d, i) => i / steps);
      this.legend
        .append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style('fill', color.rgbString())
        .attr('x', '40')
        .attr('y', '35')
        .attr('width', 18)
        .attr('height', 18)
        .attr('transform', function (d, i) {
          return 'translate(' + offset + ',' + (i * 20) + ')';
        })
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill-opacity', (d, i) => i / steps)
        .text(function (d, i) {
          return ((i / steps) * max);
        });
    }
  }
  zoomTo(geoJSON) {
    this.projection.fitSize([this.width, this.height], geoJSON);
  }
  getStackNames() {
    if (!this.datasets) return [];
    let stackNames = this.datasets.map(dataset => String(dataset.stack));
    return Array.from(new Set(stackNames));
  }
  update() {
    this.geoJSONDidChange();
    this.datasetsDidChange();
  }
  loadGeoJSON(geoJSONURL) {
    d3.json(geoJSONURL)
      .then(function (rawJSON) {
        this.setGeoJSON(new GeoJson(rawJSON));
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      }.bind(this));
  }
  setGeoJSON(newGeoJSON) {
    this.geoJSON = newGeoJSON;
    this.geoJSONDidChange();
    this.tooltip.raise();
  }
  setDatasets(newDatasets) {
    this.datasets = newDatasets;
    this.datasetsDidChange();
    this.tooltip.raise();
    this.bounds.raise();
  }
  geoJSONDidChange() {
    if (!this.geoJSON) return;
    this.removeExcludedFeatures();
    this.zoomTo(this.geoJSON);
    this.renderGeoJson();
    this.renderDatasets();
  }
  datasetsDidChange() {
    if (!this.datasets) return;
    this.renderDatasets();
    this.renderDatasetLabels();
    this.renderDatasetsLegend();
  }
  getElementEffectiveSize() {
    let width = this.element.style('width').replace('px', '');
    let height = this.element.style('height').replace('px', '');
    return [Number(width), Number(height)];
  }
  getElementPosition() {
    let element = document.getElementById(this.selector);
    let rect = element.getBoundingClientRect();
    let xPosition = rect.x + window.scrollX;
    let yPosition = rect.y + window.scrollY;
    return [xPosition, yPosition];
  }
  removeExcludedFeatures() {
    if (!this.geoJSON) return;
    let excludedFeatureCodes = this.excludedFeatureCodes;
    for (let index = 0; index < excludedFeatureCodes.length; index++) {
      let code = excludedFeatureCodes[index];
      let candidate = this.geoJSON.features.find(feature => feature.properties.code === code);
      if (!candidate) return;
      let candidateIndex = this.geoJSON.features.indexOf(candidate);
      if (candidateIndex < 0) return;
      this.geoJSON.features.splice(candidateIndex, 1);
    }
  }
}

class Slider extends Component {
  constructor(parent) {
    super(parent);
    this.element = this.parent
      .append('div')
      .attr('id', this.selector)
      .classed('range-container', true);
    this.renderMinLabel();
    this.render();
    this.renderMaxLabel();
    this.renderValueLabel();
  }
  renderMinLabel() {
    this.minLabel = this.element
      .append('label')
      .attr('id', this.selector + '-min-label');
  }
  render() {
    this.range = this.element
      .append('input')
      .attr('type', 'range')
      .attr('name', 'mySlider')
      .attr('min', '0')
      .attr('max', '100')
      .on('input', function (event) {
        if (!event.target || event.target.value) return;
        this.valueLabel.text(event.target.value);
      }.bind(this));
  }
  renderMaxLabel() {
    this.maxLabel = this.element
      .append('label')
      .attr('id', this.selector + '-max-label');
  }
  renderValueLabel() {
    this.valueLabel = this.element
      .append('label')
      .classed('range-value-label', true);
  }
  get value() {
    return d3.select(this.range).attr('value');
  }
  set value(newValue) {
    this.range.attr('value', newValue);
    this.valueLabel.text(newValue);
  }
  set minimum(newMin) {
    this.range.attr('min', newMin);
    this.minLabel.text(newMin);
  }
  set maximum(newMax) {
    this.range.attr('max', newMax);
    this.maxLabel.text(newMax);
  }
}

class MapChartSettingsPopup extends Popup {
  render() {
    this.card
      .headerRow
      .append('h3')
      .text(Language.translate('Settings'));
    this.row = this.card.body
      .append('div')
      .classed('row', true);
    this.renderShowLabelsCheckbox();
  }
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText(Language.translate('Labels'));
    this.showLabelsCheckbox.onClick = function (checked) {
      this.mapChart.isShowLabels = checked;
      this.mapChart.update();
      URLParameters.getInstance().setWithoutDeleting('map-show-labels', checked);
    }.bind(this);
  }
  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }
  willShow() {
    super.willShow();
    this.loadValues();
  }
  loadValues() {
    this.showLabelsCheckbox.setChecked(this.mapChart.isShowLabels);
    console.log('this.mapChart.showLabels: ' + this.mapChart.isShowLabels);
  }
}

class MapChartCard extends Card {
  constructor(parent) {
    super(parent);
    this.renderMenuItems();
    this.renderMapChart();
  }
  renderSlider() {
    this.slider = new Slider(this.headerCenterComponent);
    this.slider.minimum = 1995;
    this.slider.maximum = 2020;
    this.slider.value = 2000;
  }
  renderMenuItems() {
    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.setFontAwesomeImage('camera');
    this.screenshotButton.onClick = this.screenshotButtonAction.bind(this);
    this.moreButton = new Button(this.headerRightComponent);
    this.moreButton.setText('More');
    this.moreButton.element.classed('simple-button', true);
    this.moreButton.setFontAwesomeImage('ellipsis-h');
    this.moreButton.onClick = this.presentSettingsPopupAction.bind(this);
  }
  renderMapChart() {
    this.mapChart = new MapChart(this.body);
    this.mapChart.loadGeoJSON('/assets/Departements-Simple.geojson');
  }
  screenshotButtonAction() {
    let name = 'my_image.jpg';
    let chartID = this.mapChart.selector;
    screenshotElement("#" + chartID, name);
  }
  presentSettingsPopupAction() {
    let application = window.frcvApp;
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new MapChartSettingsPopup(application.element);
    settingsPopup.mapChart = this.mapChart;
    settingsPopup.showUnder(button, 'right');
  }
}

class TrackPopup extends Popup {
    render() {
        super.render();
        this.renderHeadline();
        this.renderRow();
        this.renderTrackContentContainer();
    }
    renderHeadline() {
        this.card
            .headerRow
            .append('h3')
            .text(Language.translate('Track'));
    }
    renderRow() {
        this.row = this.card.body
            .append('div')
            .classed('row', true);
    }
    renderTrackContentContainer() {
        this.lyricsContainer = this.row
            .append('div')
            .classed('col-12', true)
            .append('p');
    }
    update() {
        if (!this.track) return;
        let input = this.searchWord;
        let content = String(this.track.content);
        let lines = content.split('\n');
        let html = '';
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let words = line.split(' ');
            for (let j = 0; j < words.length; j++) {
                let word = words[j];
                if (word.toLowerCase() === input.toLowerCase()) {
                    html += `<b class="important">${word}</b>`;
                } else if (word.toLowerCase() === `${input},`.toLowerCase()) {
                    html += `<b class="important">${word}</b>`;
                } else {
                    html += word;
                }
                html += ' ';
            }
            html += '<br>';
        }
        this.lyricsContainer.html(html);
    }
    preferredSize() {
        return {
            width: 800,
            height: 600
        };
    }
}

class WordAboutCard extends Card {
  constructor(parent) {
    super(parent);
  }
  update() {
    this.body.html('');
    if (!this.datasets) return;
    this.divs = this.body
      .selectAll('div')
      .data(this.datasets)
      .enter()
      .append('div')
      .html(function (dataset, index) {
        let components = [];
        if (index !== 0) {
          components.push(`<br>`);
        }
        components.push(`<b class="larger">`);
        components.push(`${dataset.label}`);
        components.push(` (${dataset.data.length} Tracks)`);
        components.push(`</b>`);
        return components.join('');
      })
      .selectAll("div")
      .data(function (dataset) {
        dataset.data.forEach(item => item.dataset = dataset.label);
        return dataset.data
          .sort(function (item1, item2) {
            return d3.descending(item1.releaseYear, item2.releaseYear);
          });
      })
      .enter()
      .append("div")
      .style('cursor', 'pointer')
      .html(function (item) {
        let components = [];
        components.push(`<span class="primary">${item.title}</span>`);
        components.push(`<span class="secondary">(by ${item.artist}, ${item.releaseYear})</span>`);
        return `<li>${components.join(' ')}</li>`;
      })
      .on('click', function (event, item) {
        let parent = window.frcvApp.element;
        let popup = new TrackPopup(parent);
        console.log(item);
        popup.searchWord = item.dataset;
        popup.track = item;
        popup.update();
        popup.showBigModal();
      });
  }
}

class DatasetCollection extends Array {
}

class SearchPage extends Page {
    constructor(application) {
        super(application, Language.translate('Search'));
        application.makeContainerFull();
        this.renderSettingsButton();
        this.renderSearchInputCard();
        this.renderDiachronicChart();
        this.renderMapChart();
        this.renderWordAboutCard();
        this.loadCorpusIfNeeded();
        this.applyURLParameters();
    }
    renderSettingsButton() {
        this.settingsButton = new Button(this.rightHeaderContainer);
        this.settingsButton.setText(Language.translate('Settings'));
        this.settingsButton.element.classed('simple-button button-down', true);
        let thisReference = this;
        this.settingsButton.onClick = function (event) {
            if (!event || !event.target) return;
            let settingsPopup = new SearchPageSettingsPopup(thisReference.application.element);
            settingsPopup.searchPage = thisReference;
            settingsPopup.showUnder(event.target, 'right');
        };
    }
    renderSearchInputCard() {
        this.searchCardContainer = this.addContainer(this.row, 'col-12');
        this.searchCard = new SearchCard(this.searchCardContainer);
        let thisReference = this;
        this.searchCard.startSearching = function () {
            thisReference.startSearching();
        };
    }
    renderDiachronicChart() {
        this.diachronicChartCardContainer = this.addContainer(this.row, 'col-12 col-lg-6');
        this.diachronicChartCard = new DiachronicChartCard(this.diachronicChartCardContainer, null);
        this.diachronicChartCard.titleLabel.text(Language.translate('Chart'));
        this.diachronicChart = this.diachronicChartCard.chart;
        this.searchCard.diachronicChart = this.diachronicChart;
        this.diachronicChart.margin = {top: 40, left: 40, bottom: 80, right: 40};
        this.diachronicChartCard.footer.style('display', 'none');
    }
    renderMapChart() {
        this.mapCardContainer = this.addContainer(this.row, 'col-12 col-lg-6');
        this.mapChartCard = new MapChartCard(this.mapCardContainer);
        this.mapChartCard.titleLabel.text(Language.translate('Map'));
    }
    renderWordAboutCard() {
        this.wordAboutCardContainer = this.addContainer(this.row, 'col-12 col-lg-6');
        this.wordAboutCard = new WordAboutCard(this.diachronicChartCardContainer);
        this.wordAboutCard.titleLabel.text(Language.translate('Word About'));
    }
    willLoadCorpus() {
        super.willLoadCorpus();
        this.loadingView = this.addLoadingView(this.row);
        this.diachronicChartCardContainer.style('display', 'none');
        this.mapCardContainer.style('display', 'none');
    }
    didLoadCorpus() {
        super.didLoadCorpus();
        this.loadingView.remove();
        this.diachronicChartCardContainer.style('display', 'block');
        this.mapCardContainer.style('display', 'block');
        if (this.searchCard.getSearchText()) {
            this.startSearching();
        }
    }
    useFullWidthMode() {
        this.diachronicChartCardContainer
            .classed('col-lg-12', true)
            .classed('col-lg-6', false);
        this.mapCardContainer
            .classed('col-lg-12', true)
            .classed('col-lg-6', false);
        this.wordAboutCardContainer
            .classed('col-lg-12', true)
            .classed('col-lg-6', false);
    }
    useHalfWidthMode() {
        this.diachronicChartCardContainer
            .classed('col-lg-12', false)
            .classed('col-lg-6', true);
        this.mapCardContainer
            .classed('col-lg-12', false)
            .classed('col-lg-6', true);
        this.wordAboutCardContainer
            .classed('col-lg-12', false)
            .classed('col-lg-6', true);
    }
    setViewMode(viewMode, save = false) {
        this.viewMode = viewMode;
        switch (viewMode) {
            case 'full':
                this.useFullWidthMode();
                break;
            case 'half':
                this.useHalfWidthMode();
                break;
        }
        if (save) {
            localStorage.setItem(SearchPage.viewModeKey, viewMode);
        }
    }
    applyURLParameters() {
        let parameters = URLParameters.getInstance();
        let searchText = parameters.getString(URLParameters.query);
        let searchSensitivity = parameters.getString(URLParameters.searchSensitivity, 'case-insensitive');
        let startYear = parameters.getString(URLParameters.startYear, '2000');
        let endYear = parameters.getString(URLParameters.endYear, '2020');
        let valueType = parameters.getString(URLParameters.valueType, 'relative');
        this.searchCard.searchField.setText(searchText);
        this.searchCard.sensitivityDropdown.setSelectedOption(searchSensitivity);
        this.searchCard.yearStartDropdown.value = startYear;
        this.searchCard.yearEndDropdown.value = endYear;
        this.searchCard.valueType = valueType;
        this.searchCard.valueRadioGroup.setSelectedOption(valueType);
        let viewModeURL = URLParameters.getInstance().getString(URLParameters.searchViewMode);
        let viewModeLocalStorage = localStorage.getItem(SearchPage.viewModeKey);
        if (viewModeURL) {
            this.setViewMode(viewModeURL);
        } else if (viewModeLocalStorage) {
            this.setViewMode(viewModeLocalStorage);
        } else {
            this.setViewMode('half');
        }
        let showChart = parameters.getBoolean('show-chart', true);
        showChart ? this.showChart() : this.hideChart();
        let showMap = parameters.getBoolean('show-map', true);
        showMap ? this.showMap() : this.hideMap();
    }
    showChart() {
        this.diachronicChartCard.element.style('display', 'block');
    }
    hideChart() {
        this.diachronicChartCard.element.style('display', 'none');
    }
    showMap() {
        this.mapChartCard.element.style('display', 'block');
    }
    hideMap() {
        this.mapChartCard.element.style('display', 'none');
    }
    showWordAbout() {
        this.wordAboutCard.element.style('display', 'block');
    }
    hideWordAbout() {
        this.wordAboutCard.element.style('display', 'none');
    }
    startSearching() {
        if (!this.application.isCorpusLoaded()) return;
        let searchText = this.searchCard.getSearchText();
        let searchField = this.searchCard.searchField;
        if (searchText === undefined) {
            return console.log('search text undefined');
        } else if (searchText.trim().length === 0) {
            return console.log('search text too short');
        }
        RecentSearches.getInstance().append(searchText);
        searchField.updateRecentSearches();
        this.searchFor(searchText);
    }
    searchFor(searchQuery) {
        let groups = searchQuery.split(';').map(value => value.trim());
        groups = groups.map(group => group.split(',').map(word => word.trim()).join(','));
        groups = groups.map(group => group.trim());
        let searchTextFormatted = groups.join(';');
        let localDatasets = [];
        let mapDatasets = [];
        let trackDatasets = new DatasetCollection();
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            let words = group.split(',').map(value => value.trim());
            let stack = words.join(", ");
            for (let j = 0; j < words.length; j++) {
                let searchWord = words[j];
                let datasetObject = this.datasetFor(searchWord);
                let data = datasetObject.chartData;
                let mapData = datasetObject.mapData;
                let tracks = datasetObject.tracks;
                let newDataset = {
                    label: searchWord,
                    stack: stack,
                    data: data
                };
                if (this.searchCard.valueType === 'relative') {
                    data.forEach(item => item.value = (item.value / item.yearTotal));
                }
                let mapDataset = {
                    label: searchWord,
                    stack: stack,
                    data: mapData
                };
                localDatasets.push(newDataset);
                mapDatasets.push(mapDataset);
                trackDatasets.push({
                    label: searchWord,
                    stack: stack,
                    data: tracks
                });
            }
        }
        this.diachronicChart.datasets = localDatasets;
        this.diachronicChart.update();
        this.mapChartCard.mapChart.datasets = mapDatasets;
        this.mapChartCard.mapChart.update();
        this.wordAboutCard.datasets = trackDatasets;
        this.wordAboutCard.update();
        URLParameters.getInstance().set(URLParameters.query, searchTextFormatted);
    }
    datasetFor(searchText) {
        let sensitivity = this.searchCard.sensitivity;
        let firstYear = this.searchCard.firstYear;
        let lastYear = this.searchCard.lastYear;
        let corpus = this.application.corpus;
        let tracks = corpus.tracksForWord(searchText, sensitivity);
        tracks = tracks.filter(function (track) {
            return track.releaseYear >= firstYear
                && track.releaseYear <= lastYear;
        });
        let mapData = corpus.getMapDataForTracks(tracks);
        mapData.forEach((item) => item.datasetName = searchText);
        let chartData = corpus.getChartDataForTracks(
            tracks,
            firstYear,
            lastYear,
            sensitivity
        );
        return {
            mapData: mapData,
            chartData: chartData,
            searchText: searchText,
            tracks: tracks
        };
    }
    applyMapData(mapData) {
        let color = randomColor();
        for (let i = 0; i < mapData.length; i++) {
            const entry = mapData[i];
            const departementNumber = entry.departementNumber;
            const numberOfLyrics = entry.value;
            if (numberOfLyrics === 0) {
                continue;
            }
            const departement = this.application.getDepartementForNumber(departementNumber);
            this.mapChart.drawDepartement(departement, color, "" + numberOfLyrics);
        }
    }
}
SearchPage.viewModeKey = 'de.beuth.frc-visualization.SearchPageViewMode';

class CorpusDataPage extends Page {
  constructor(application) {
    super(application, Language.translate('Corpus Metadata'));
    this.createLeftPanel();
    this.createCard();
    this.loadCorpusIfNeeded();
  }
  willLoadCorpus() {
    super.willLoadCorpus();
    this.loadingView = this.addLoadingView(this.cardBody);
  }
  didLoadCorpus() {
    super.didLoadCorpus();
    this.loadingView.remove();
    this.update();
  }
  createLeftPanel() {
    this.leftPanel = this.addContainer(this.row, 'col-lg-3');
    this.titleLabel = this.leftPanel
      .append('h1')
      .text(this.title);
  }
  createCard() {
    this.wrapper = this.addContainer(this.row, 'col-lg-6 col-12');
    this.card = this.addContainer(this.wrapper, 'card card-corpus-metadata');
    this.cardBody = this.addContainer(this.card, 'card-body');
    this.cardBodyRow = this.addRow(this.cardBody);
  }
  update() {
    this.clearContent();
    let corpus = this.application.corpus;
    this.currentGroup = this.createGroup();
    this.createLine('# Artists', corpus.artists.length);
    this.createLine('# Female Artists', corpus.femaleArtists().length);
    this.createLine('# Male Artists', corpus.maleArtists().length);
    this.createLine('# Group Artists', corpus.groupArtists().length);
    this.currentGroup = this.createGroup();
    this.createLine('# Albums', corpus.allAlbums().length);
    this.currentGroup = this.createGroup();
    this.createLine('# Tracks w/o Album', corpus.allTracksWithoutAlbum().length);
    this.createLine('# Tracks', corpus.allTracks().length);
    this.currentGroup = this.createGroup();
    this.createLine('# Words', corpus.allWords().length);
  }
  createGroup() {
    return this.addContainer(this.cardBodyRow, 'group');
  }
  createLine(title, value) {
    let row = this.currentGroup
      .append('div')
      .classed('row text-vertical-center', true);
    row.append('div')
      .classed('col-6 text-end label', true)
      .text(appendColon(title));
    row.append('div')
      .classed('col-6', true)
      .append('samp')
      .text(value);
  }
  clearContent() {
    this.cardBody.selectAll('div').remove();
    this.cardBodyRow = this.addRow(this.cardBody);
  }
}
function appendColon(text) {
  return text.endsWith(':') ? text : text + ':';
}

class ProgressBar extends Component {
  constructor(parent) {
    super(parent);
    this.renderBar();
  }
  renderBar() {
    this.barContainerSelector = createUUID();
    this.barContainer = this.parent
      .append('div')
      .attr('id', this.barContainerSelector)
      .attr('class', 'progress-bar-container');
    this.element = this.barContainer;
    this.barSelector = createUUID();
    this.bar = this.barContainer
      .append('div')
      .attr('id', this.barSelector)
      .attr('class', 'progress-bar')
      .html('&nbsp;');
  }
  set value(newValue) {
    let valueAsNumber = Number(newValue);
    let barContainer = document.getElementById(this.barContainerSelector);
    let totalWidth = barContainer.getBoundingClientRect().width;
    let totalWidthAsNumber = Number(totalWidth);
    let width = (totalWidthAsNumber * valueAsNumber);
    document.getElementById(this.barSelector)
      .setAttribute('style', 'width:' + width + 'px');
  }
  get value() {
    let totalWidth = document.getElementById(this.barContainerSelector).style.width;
    document.getElementById(this.barSelector).style.width;
    console.log('totalWidth: ' + totalWidth);
  }
}

class MainPage extends Page {
  constructor(application) {
    super(application, 'Main');
    if (!application) {
      throw 'No application given.';
    }
    this.application = application;
    this.element = application.element;
    this.renderLeftTitleComponent();
    this.renderMenuCard();
    this.renderMenuItems();
    this.renderProgressBar();
    this.hideBackButton();
    this.updateFooterURL();
    this.updateFooterDebugInfo();
    this.loadData();
  }
  renderLeftTitleComponent() {
    this.titleContainer = this.row
      .append('div')
      .classed('col-lg-3', true);
    let title = this.application.delegate.name;
    this.titleLabel = this.titleContainer
      .append('h1')
      .text(title);
    this.titleInfoBox = this.titleContainer
      .append('div')
      .classed('info-box', true);
  }
  renderMenuCard() {
    this.menuCardContainer = this.row
      .append('div')
      .classed('col-6', true);
    this.menuCard = this.menuCardContainer
      .append('div')
      .classed('card card-inset menu', true);
  }
  renderMenuItems() {
    let application = this.application;
    let pages = [
      ['search', Language.translate('Search')],
      ['diachronic-data', Language.translate('Diachronic Data')],
      ['diatopic-data', Language.translate('Diatopic Data')],
      ['corpus-data', Language.translate('Corpus Data')]
    ];
    for (let i = 0; i < pages.length; i++) {
      let pageItem = pages[i];
      let pageId = pageItem[0];
      let pageTitle = pageItem[1];
      this.addMenuButton(pageTitle, function () {
        application.showPage(pageId, true);
      });
    }
  }
  addMenuButton(name, functionToCall) {
    let link = this.menuCard
      .append('a')
      .text(name)
      .on('click', function () {
        if (!functionToCall)
          return;
        functionToCall();
      });
    this.menuCard.append('br');
    return link;
  }
  renderProgressBar() {
    this.progressBar = new ProgressBar(this.menuCardContainer);
    this.progressBar.value = 0;
  }
  loadData() {
    let delegate = this.application.delegate;
    if (delegate.rawJSON) return;
    let progressBar = this.progressBar;
    delegate.loadData(function (progress, error) {
      progressBar.value = progress;
    }, function () {
      progressBar.hide();
    });
  }
}

class DiachronicAboutPage extends Page {
    constructor(application) {
        super(application, Language.translate('Diachronic About'));
        this.contentType = 'tracks';
        this.buildSubpage();
        this.renderDiachronicChart();
        this.renderContentRadioGroup();
        this.applyURLParameters();
        this.loadCorpusIfNeeded();
    }
    renderDiachronicChart() {
        this.chartWrapper = this
            .addContainer(this.row, 'col-12')
            .append('div');
        this.chartCard = new DiachronicChartCard(this.chartWrapper, 'Chart');
        this.chart = this.chartCard.chart;
        this.chartCard.chart.margin = {
            top: 60, left: 50, bottom: 70, right: 50
        };
    }
    renderContentRadioGroup() {
        this.radioGroup = new RadioGroup(this.chartCard.headerCenterComponent);
        this.radioGroup.setOptions([
            ['tracks', Language.translate('Tracks')],
            ['words', Language.translate('Words')],
            ['words-relative', Language.translate('Words (Relative)')],
            ['types', Language.translate('Types')],
            ['types-relative', Language.translate('Types (Relative)')],
        ]);
        this.radioGroup.onChange = function (value) {
            this.contentType = value;
            this.update();
        }.bind(this);
    }
    willLoadCorpus() {
        super.willLoadCorpus();
        this.showLoadingView();
    }
    didLoadCorpus() {
        super.didLoadCorpus();
        this.hideLoadingView();
        this.update();
    }
    applyURLParameters() {
        this.contentType = URLParameters.getInstance().getString(
            URLParameters.contentType, 'tracks');
        this.radioGroup.setSelectedOption(this.contentType);
    }
    update() {
        let corpus = this.application.corpus;
        if (!corpus) return;
        this.setCorpus(corpus);
    }
    contentTypeDidChange() {
    }
    setCorpus(corpus) {
        let yearCollection;
        switch (this.contentType) {
            case 'tracks':
                yearCollection = corpus.getLyricsPerYear();
                break;
            case 'words':
                yearCollection = corpus.getWordsPerYear();
                break;
            case 'words-relative':
                yearCollection = corpus.getWordsPerYearRelative();
                break;
            case 'types':
                yearCollection = corpus.getTypesPerYear();
                break;
            case 'types-relative':
                yearCollection = corpus.getTypesPerYearRelative();
                break;
            case 'non-standard':
                yearCollection = corpus.getTotalNonStandardPerYearCount();
                break;
            default:
                yearCollection = [];
                break;
        }
        URLParameters.getInstance().set(URLParameters.contentType, this.contentType);
        let title = this.contentType.capitalize();
        let dataset = {
            label: title,
            stack: title,
            data: []
        };
        let firstYear = d3.min(Object.keys(yearCollection));
        let lastYear = d3.max(Object.keys(yearCollection));
        for (let year = firstYear; year <= lastYear; year++) {
            dataset.data.push({
                year: year,
                value: yearCollection[year] || 0,
                yearTotal: yearCollection[year] || 0
            });
        }
        this.chart.datasets = [dataset];
        this.chart.update();
    }
}
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class ArtistsDataPage extends Page {
    constructor(application) {
        super(application, 'Artists Metadata');
        this.buildSubpage();
        this.createCard();
        this.createContentTypeRadioGroup();
        this.valueGettingFunction = this.numberOfTypes;
        this.initialize();
        this.renderSVG();
        this.renderTooltip();
        this.loadCorpusIfNeeded();
    }
    initialize() {
        this.width = 1000;
        this.margin = {top: 20, right: 70, bottom: 50, left: 180};
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.lineHeight = 18;
    }
    renderSVG() {
        this.chartView = this.card.content;
        this.svg = this.chartView
            .append("svg");
        this.graph = this.svg
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }
    renderTooltip() {
        this.tooltip = this.card.content
            .append("div")
            .attr("class", "tooltip map-tooltip")
            .style("position", "absolute")
            .style("border", "1px solid #69b3a2")
            .style("display", "none");
    }
    buildVisual(data) {
        const margin = this.margin;
        const max = d3.max(data, (item) => item.value);
        const colorString = colorsForStack(0, 1)[0].rgbString();
        this.graphHeight = (this.lineHeight * data.length);
        this.height = this.graphHeight + (margin.top + margin.bottom);
        this.graph.selectAll('g').remove();
        this.graph.selectAll('text').remove();
        this.graph.selectAll('rect').remove();
        this.svg.attr('viewBox', `0 0 ${this.width} ${this.height}`);
        const x = d3.scaleLinear()
            .domain([0, max])
            .range([0, this.graphWidth]);
        const y = d3.scaleBand()
            .range([0, this.graphHeight])
            .domain(data.map((item) => `${item.name} (${item.geniusId})`))
            .padding(.1);
        this.graph
            .append("g")
            .attr("transform", "translate(0," + this.graphHeight + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        this.graph
            .append("g")
            .call(d3.axisLeft(y));
        const barGroup = this.graph
            .selectAll("chart-rect")
            .data(data)
            .enter()
            .append("rect")
            .classed("chart-rect", true);
        barGroup
            .attr("x", x(0))
            .attr("y", (item) => y(`${item.name} (${item.geniusId})`))
            .attr("width", (item) => x(item.value))
            .attr("height", y.bandwidth())
            .attr("fill", colorString)
            .attr("rx", "4")
            .attr("ry", this.lineHeight / 2);
        barGroup
            .on("mousemove", function (event, item) {
                this.tooltip
                    .style("display", "inline-block")
                    .html('Value: ' + (item.value) + "<br>Artist: " + item.name);
                let tooltipWidth = this.tooltip.style('width').replace('px', '');
                let element = document.getElementById('content');
                let offset = element.getBoundingClientRect();
                let width = this.chartView.style('width').replace('px', '');
                let ratio = width / 1000;
                console.log('ratio: ' + ratio);
                let xPos = x(item.value) / 2;
                xPos += offset.x;
                xPos *= ratio;
                xPos += margin.left;
                xPos += window.scrollX;
                xPos -= tooltipWidth / 2;
                let yPos = y(`${item.name} (${item.geniusId})`);
                yPos += margin.top;
                yPos *= ratio;
                yPos += offset.y;
                yPos += this.lineHeight;
                yPos += window.scrollY;
                this.tooltip
                    .style("left", xPos + "px")
                    .style("top", yPos + "px")
                    .style("position", "absolute")
                    .style("border", "1px solid #69b3a2")
                    .style("display", "inline-block")
                    .html('Value: ' + (item.value) + "<br>Artist: " + item.name);
            }.bind(this))
            .on("mouseout", function (d) {
                this.tooltip.style("display", "none");
            }.bind(this));
        this.graph
            .selectAll(".text")
            .data(data)
            .enter()
            .append('text')
            .text((item) => item.value)
            .attr("x", (item) => x(item.value))
            .attr("y", (item) => y(`${item.name} (${item.geniusId})`))
            .attr('dy', this.lineHeight - 6)
            .attr('dx', '6')
            .attr("width", (item) => x(item.value))
            .attr("height", y.bandwidth())
            .attr("font-size", 13)
            .attr('fill', 'gray');
    }
    willLoadCorpus() {
        super.willLoadCorpus();
        this.loadingView = this.addLoadingView(this.card.body);
    }
    didLoadCorpus() {
        super.didLoadCorpus();
        this.update();
        this.loadingView.remove();
    }
    createCard() {
        this.cardContainer = this.addContainer(this.row, 'col-12');
        this.card = new Card(this.cardContainer);
    }
    createContentTypeRadioGroup() {
        this.card.headerCenterComponent
            .classed('text-center', true)
            .append('div')
            .attr('id', 'radio-group-2');
        this.radioGroup = new RadioGroup(this.card.headerCenterComponent);
        this.radioGroup.setOptions([
            ['types', 'Types'],
            ['words', 'Words'],
            ['tracks', 'Tracks'],
            ['albums', 'Albums']
        ]);
        this.radioGroup.onChange = function (value) {
            this.chartTypeAction(value);
        }.bind(this);
    }
    chartTypeAction(value) {
        console.log("value: " + value);
        switch (value) {
            case 'types':
                this.valueGettingFunction = this.numberOfTypes;
                break;
            case 'words':
                this.valueGettingFunction = this.numberOfWords;
                break;
            case 'tracks':
                this.valueGettingFunction = this.numberOfTracks;
                break;
            case 'albums':
                this.valueGettingFunction = this.numberOfAlbums;
                break;
            default:
                console.log("unknown chart type: " + value);
                break;
        }
        this.update();
    }
    numberOfTypes(artist) {
        return (new Set(artist.allWords())).size;
    }
    numberOfWords(artist) {
        return artist.allWords().length;
    }
    numberOfTracks(artist) {
        return artist.allTracks().length;
    }
    numberOfAlbums(artist) {
        return artist.albums.length;
    }
    update() {
        let corpus = this.application.corpus;
        if (!corpus) return;
        d3.hierarchy(corpus.artists);
        const artists = corpus.artists
            .filter((artists) => artists.allTracks().length > 0)
            .reverse();
        let data = [];
        for (let i = 0; i < artists.length; i++) {
            let artist = artists[i];
            let artistName = artist.name;
            let value = this.valueGettingFunction(artist);
            data.push({
                name: artistName,
                geniusId: artist.geniusId,
                departement: artist.departement,
                departementNo: artist.departementNo,
                value: Number(value)
            });
        }
        data = d3.sort(data, function (a, b) {
            return b.value - a.value;
        });
        const countAll = data.length;
        data = data.filter((item) => item.value > 0);
        const countFiltered = data.length;
        console.log("countAll: " + countAll);
        console.log("countFiltered: " + countFiltered);
        this.buildVisual(data);
    }
    buildHistogram(data) {
    }
}

class LocationDataPage extends Page {
  constructor(application) {
    let title = Language.translate('Location Data');
    super(application, title);
    this.buildSubpage();
    this.applyURLParameters();
    this.loadGeoJSONFromDelegate();
    this.didLoadGeoJSONFromDelegate();
  }
  renderBody() {
    super.renderBody();
    this.mapChartContainer = this.row.append('div').classed('col-12', true);
    this.mapChartCard = new MapChartCard(this.mapChartContainer);
    this.mapChartCard.titleLabel.text(Language.translate('Map'));
    this.mapChartCard.mapChart.isDrawsBackground = false;
    this.mapChartCard.mapChart.isShowLabels = true;
    this.mapChartCard.mapChart.isZoomable = false;
  }
  applyURLParameters() {
    let parameters = URLParameters.getInstance();
    let showLabels = parameters.getBoolean('map-show-labels', true);
    this.mapChartCard.mapChart.isShowLabels = showLabels;
    this.mapChartCard.mapChart.update();
  }
  loadGeoJSONFromDelegate() {
    let url = this.application.delegate.geoJSON;
    this.mapChartCard.mapChart.loadGeoJSON(url);
  }
  didLoadGeoJSONFromDelegate() {
    this.mapChartCard.mapChart;
    this.application.corpus;
  }
}

class DataDelegate {
  constructor() {
  }
}

class DefaultDataDelegate extends DataDelegate {
  constructor() {
    super();
    this.name = 'Lotivis';
  }
}

class Application {
  constructor(selector, delegate) {
    if (!selector) throw 'No selector specified.';
    if (!delegate) delegate = new DefaultDataDelegate();
    this.selector = selector;
    this.delegate = delegate;
    this.willInitialize();
    this.initialize();
    this.didInitialize();
  }
  willInitialize() {
  }
  initialize() {
    this.element = d3
      .select(`#${this.selector}`)
      .classed('container', true);
    window.lotivisApplication = this;
    let parameters = URLParameters.getInstance();
    let language = parameters.getString(URLParameters.language, Language.English);
    Language.setLanguage(language);
  }
  didInitialize() {
    this.loadPage();
  }
  clearContainer() {
    document.getElementById(this.selector).innerHTML = '';
  }
  loadPage() {
    let page = URLParameters.getInstance().getString(URLParameters.page, 'main');
    this.showPage(page, false);
  }
  showPage(selector, updateHistory = false) {
    this.clearContainer();
    if (updateHistory) {
      URLParameters.getInstance().clear();
      URLParameters.getInstance().set(URLParameters.page, selector);
      URLParameters.getInstance().set(URLParameters.language, Language.language);
    }
    this.currentPageSelector = selector;
    switch (selector) {
      case 'search':
        this.currentPage = new SearchPage(this);
        break;
      case 'about':
        this.currentPage = new AboutPage(this);
        break;
      case 'corpus-data':
        this.currentPage = new CorpusDataPage(this);
        break;
      case 'artists-data':
        this.currentPage = new ArtistsDataPage(this);
        break;
      case 'diachronic-data':
        this.currentPage = new DiachronicAboutPage(this);
        break;
      case 'diatopic-data':
        this.currentPage = new LocationDataPage(this);
        break;
      default:
        this.currentPage = new MainPage(this);
        this.currentPageSelector = 'main';
        break;
    }
    console.log(this.currentPage);
  }
  reloadPage() {
    this.showPage(this.currentPageSelector);
  }
  makeFluit() {
    this.element.classed('container-fluit', true);
    this.element.classed('container', false);
  }
  makeUnfluit() {
    this.element.classed('container-fluit', false);
    this.element.classed('container', true);
  }
  isCorpusLoaded() {
    return this.corpus !== undefined;
  }
  loadCorpus(completion) {
    this.isLoading = true;
    let url = "../../corpus/original";
    d3.json(url)
      .then(function (json) {
      });
  }
  fetchDepartements(completion) {
    let thisReference = this;
    this.isFetchingDepartements = true;
    fetch("../../departements")
      .then(response => response.json())
      .then(function (json) {
        thisReference.departements = json;
        thisReference.corpus.departements = json;
        thisReference.isFetchingDepartements = false;
        if (completion) {
          completion();
        }
      });
  }
  getDepartementForNumber(departementNumber) {
    for (let i = 0; i < this.departements.length; i++) {
      const departement = this.departements[i];
      if (departementNumber === departement.deptCode) {
        return departement;
      }
    }
    return null;
  }
  makeContainerNormal() {
    this.element.classed('container-full', false);
    this.element.classed('container', true);
  }
  makeContainerFull() {
    this.element.classed('container', false);
    this.element.classed('container-full', true);
  }
}
Application.Pages = {};
exports.DataDelegate = DataDelegate;

exports.Application = Application;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lotivis.js.map
