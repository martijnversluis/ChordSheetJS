import FormatterBase from './formatter_base';

const NEW_LINE = '\n';

export default class ChordProFormatter extends FormatterBase {
  constructor() {
    super();
    this.dirtyLine = false;
  }

  formatItem(item) {
    if (item.chords) {
      this.output('[' + item.chords + ']');
    }
    
    this.output(item.lyrics);
    this.dirtyLine = true;
  }

  endOfSong() {
    this.newLine();
  }

  newLine() {
    this.output(NEW_LINE);
  }
}
