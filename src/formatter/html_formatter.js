import FormatterBase from './formatter_base';

export default class HtmlFormatter extends FormatterBase {
  constructor() {
    super();
    this.dirtyLine = false;
    this.lineEmpty = true;
  }

  formatMetaData(song) {
    if (song.title) {
      this.output(`<h1>${song.title}</h1>`);
    }

    if (song.subtitle) {
      this.output(`<h2>${song.subtitle}</h2>`);
    }
  }

  newLine() {
    if (this.dirtyLine) {
      this.finishLine();
    }
  }

  endOfSong() {
    if (this.dirtyLine) {
      this.finishLine();
    }
  }
}
