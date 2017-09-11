import FormatterBase from './formatter_base';
import Tag from "../chord_sheet/tag";

const NEW_LINE = '\n';

export default class ChordProFormatter extends FormatterBase {
  constructor() {
    super();
  }

  formatItem(item) {
    if (item instanceof Tag) {
      this.output(this.formatTag(item));
    } else {
      if (item.chords) {
        this.output('[' + item.chords + ']');
      }

      if (item.lyrics) {
        this.output(item.lyrics);
      }
    }
  }

  formatTag(tag) {
    if (tag.hasValue()) {
      return `{${tag.originalName}: ${tag.value}}`;
    }

    return `{${tag.originalName}}`;
  }

  endOfSong() { }

  newLine() {
    if (this.stringOutput) {
      this.output(NEW_LINE);
    }
  }
}
