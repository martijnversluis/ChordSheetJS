import FormatterBase from './formatter_base';

const NEW_LINE = '\n';

export default class ChordProFormatter extends FormatterBase {
  constructor() {
    super();
    this.dirtyLine = false;
  }

  formatChordLyricsPair(chordLyricsPair) {
    if (chordLyricsPair.chords) {
      this.output('[' + chordLyricsPair.chords + ']');
    }
    
    this.output(chordLyricsPair.lyrics);
    this.dirtyLine = true;
  }

  endOfSong() {
    this.newLine();
  }

  newLine() {
    this.output(NEW_LINE);
  }
}
