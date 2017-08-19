import Song from '../chord_sheet/song';

const WHITE_SPACE = /\s/;
const CHORD_LINE_REGEX = /^\s*((([A-G])(#|b)?([^\/\s]*)(\/([A-G])(#|b)?)?)(\s|$)+)+(\s|$)+/;

export default class ChordSheetParser {
  parse(document) {
    this.initialize(document);

    while (this.hasNextLine()) {
      const line = this.readLine();
      this.parseLine(line);
    }

    return this.song;
  }

  parseLine(line) {
    this.songLine = this.song.addLine();

    if (line.trim().length === 0) {
      this.chordLyricsPair = null;
    } else {
      this.chordLyricsPair = this.songLine.addChordLyricsPair();

      if (CHORD_LINE_REGEX.test(line) && this.hasNextLine()) {
        const nextLine = this.readLine();
        this.parseLyricsWithChords(line, nextLine);
      } else {
        this.chordLyricsPair.lyrics = line + '';
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
    const line = this.lines[this.currentLine];
    this.currentLine++;
    return line;
  }

  hasNextLine() {
    return this.currentLine < this.lineCount;
  }

  parseLyricsWithChords(line, nextLine) {
    this.processCharacters(line, nextLine);

    this.chordLyricsPair.lyrics += nextLine.substring(line.length);

    this.chordLyricsPair.chords = this.chordLyricsPair.chords.trim();
    this.chordLyricsPair.lyrics = this.chordLyricsPair.lyrics.trim();

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
        this.ensureChordLyricsPairInitialized();
        this.chordLyricsPair.chords += chr;
      }

      this.chordLyricsPair.lyrics += nextLine[c] || '';
    }
  }

  ensureChordLyricsPairInitialized() {
    if (!this.processingText) {
      this.chordLyricsPair = this.songLine.addChordLyricsPair();
      this.processingText = true;
    }
  }
}
