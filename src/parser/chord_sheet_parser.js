import Song from '../chord_sheet/song';

const WHITE_SPACE = /\s/;
const CHORD_LINE_REGEX = /^\s*((([A-G])(#|b)?([^\/\s]*)(\/([A-G])(#|b)?)?)(\s|$)+)+(\s|$)+/;

export default class ChordSheetParser {
  parse(document) {
    this.initialize(document);

    while (true) {
      const line = this.readLine();

      if (line === null) {
        break;
      }

      this.parseLine(line);
    }

    return this.song;
  }

  parseLine(line) {
    this.songLine = this.song.addLine();

    if (line.trim().length === 0) {
      this.songItem = null;
    } else {
      this.songItem = this.songLine.addItem();

      if (CHORD_LINE_REGEX.test(line)) {
        const nextLine = this.readLine();
        this.parseLyricsWithChords(line, nextLine);
      } else {
        this.songItem.lyrics = line + '';
      }
    }
  }

  initialize(document) {
    this.song = new Song();
    this.lines = document.split("\n");
    this.currentLine = 0;
    this.lineCount = this.lines.length;
    this.processingText = false;
  }

  readLine() {
    if (this.currentLine < this.lineCount) {
      const line = this.lines[this.currentLine]
      this.currentLine++;
      return line;
    }

    return null;
  }

  parseLyricsWithChords(line, nextLine) {
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
        this.ensureItemInitialized();
        this.songItem.chords += chr;
      }

      this.songItem.lyrics += nextLine[c] || '';
    }
  }

  ensureItemInitialized() {
    if (!this.processingText) {
      this.songItem = this.songLine.addItem();
      this.processingText = true;
    }
  }
}
