import FormatterBase from './formatter_base';
import Tag from '../chord_sheet/tag';

const NEW_LINE = '\n';

export default class TextFormatter extends FormatterBase {
  constructor() {
    super();
    this.dirtyLine = false;
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  finishLine() {
    let output = '';

    if (this.chordsLine.trim().length) {
      output += this.chordsLine + NEW_LINE;
    }

    output += this.lyricsLine + NEW_LINE;
    this.output(output);
    this.chordsLine = '';
    this.lyricsLine = '';
  }

  endOfSong() {
    this.dirtyLine ? this.finishLine() : this.output(NEW_LINE);
  }

  newLine() {
    if (this.dirtyLine) {
      this.finishLine();
    }
  }

  padString(str, length) {
    for(let l = str.length; l < length; l++, str += ' ');
    return str;
  }

  formatItem(item) {
    if (item instanceof Tag) {
      return this.formatTag(item);
    }

    let chordsLength = item.chords.length;

    if (chordsLength) {
      chordsLength++;
    }

    const length = Math.max(chordsLength, item.lyrics.length);
    this.chordsLine += this.padString(item.chords, length);
    this.lyricsLine += this.padString(item.lyrics, length);
    this.dirtyLine = true;
  }

  formatTag(tag) {
    if (tag.value.length) {
      return tag.value;
    }

    return tag.name;
  }
}
