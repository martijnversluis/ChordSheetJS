import FormatterBase from './formatter_base';
import Tag from '../chord_sheet/tag';

export default class HtmlFormatter extends FormatterBase {
  outputItem(item) {
    if (item instanceof Tag) {
      this.outputTagIfRenderable(item);
    } else {
      const { chords, lyrics } = item;
      this.outputPair(chords, lyrics);
    }
  }

  outputTagIfRenderable(tag) {
    if (tag.isRenderable()) {
      this.outputTag(tag);
    }
  }

  outputTag(tag) {
    if (tag.name === 'comment') {
      this.outputComment(tag);
    }
  }

  outputMetaData(song) {
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
