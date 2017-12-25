import FormatterBase from './formatter_base';
import Tag from '../chord_sheet/tag';

const SPACE = '&nbsp;';

export default class HtmlFormatter extends FormatterBase {
  constructor() {
    super();
    this.dirtyLine = false;
    this.lineEmpty = true;
  }

  formatItem(item) {
    if (item instanceof Tag) {
      return;
    }

    let chords = item.chords.trim();
    let lyrics = item.lyrics.trim();

    if (chords.length || lyrics.length) {
      if (chords.length > lyrics.length) {
        chords += SPACE;
      } else if (lyrics.length > chords.length) {
        lyrics += SPACE;
      }

      this.outputPair(chords, lyrics);
    }

    this.dirtyLine = true;
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
