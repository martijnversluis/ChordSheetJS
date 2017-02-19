import Song from '../chord_sheet/song';

const WHITE_SPACE = /\s/;
const CHORD_LINE_REGEX = /^\s*((([A-G])(#|b)?([^\/\s]*)(\/([A-G])(#|b)?)?)(\s|$)+)+(\s|$)+/;

export default class ChordSheetParser {
  parse(document) {
    this.initialize(document);

    for (let l = 0, lineCount = this.lines.length; l < lineCount; l++) {
      const line = this.lines[l];

      if (line.trim().length == 0) {
        this.songLine = this.song.addLine();
        this.songItem = null;
      } else {
        this.songItem = this.songLine.addItem();

        if (CHORD_LINE_REGEX.test(line)) {
          let nextLine = this.lines[l + 1];
          this.parseLine(line, nextLine);
          l++;
        } else {
          this.songItem.lyrics = line + '';
        }

        this.songLine = this.song.addLine();
      }
    }

    return this.song;
  }

  initialize(document) {
    this.song = new Song();
    this.lines = document.split("\n");
    this.songLine = this.song.addLine();
    this.processingText = false;
  }

  parseLine(line, nextLine) {
    this.processCharacters(line, nextLine);

    this.songItem.lyrics += nextLine.substring(line.length);

    this.songItem.chords = this.songItem.chords.trim();
    this.songItem.lyrics = this.songItem.lyrics.trim();

    if (!nextLine.trim().length) {
      this.songLine = this.song.addLine();
    }
  }

  processCharacters(line, nextLine) {
    for (let c = 0, charCount = line.length; c < charCount; c++) {
      const chr = line[c];

      if (WHITE_SPACE.test(chr)) {
        this.processingText = false;
      } else {
        if (!this.processingText) {
          this.songItem = this.songLine.addItem();
          this.processingText = true;
        }

        this.songItem.chords += chr;
      }

      let lyricChar = nextLine[c] || '';
      this.songItem.lyrics += lyricChar;
    }
  }
}
