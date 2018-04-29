import FormatterBase from './formatter_base';
import Tag from '../chord_sheet/tag';

const SPACE = ' ';

export default class HtmlFormatter extends FormatterBase {
  formatItem(item) {
    if (item instanceof Tag) {
      return this.formatTag(item);
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
  }

  formatTag(tag) {
    if (tag.isRenderable()) {
      return this.outputTag(tag);
    }
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
    if (this.hasDirtyLine()) {
      this.finishLine();
    }
  }

  endOfSong() {
    if (this.hasDirtyLine()) {
      this.finishLine();
    }
  }

  hasDirtyLine() {
    throw new Error(`${this.constructor.name} should implement hasDirtyLine()`);
  }
}
