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
    this.processingText = true;
  }

  readLine() {
    const line = this.lines[this.currentLine];
    this.currentLine++;
    return line;
  }

  hasNextLine() {
    return this.currentLine < this.lineCount;
  }

  parseLyricsWithChords(chordsLine, lyricsLine) {
    this.processCharacters(chordsLine, lyricsLine);

    this.chordLyricsPair.lyrics += lyricsLine.substring(chordsLine.length);

    this.chordLyricsPair.chords = this.chordLyricsPair.chords.trim();
    this.chordLyricsPair.lyrics = this.chordLyricsPair.lyrics.trim();

    if (!lyricsLine.trim().length) {
      this.songLine = this.song.addLine();
    }
  }

  processCharacters(chordsLine, lyricsLine) {
    for (let c = 0, charCount = chordsLine.length; c < charCount; c++) {
      const chr = chordsLine[c];
      const nextChar = chordsLine[c + 1];
      const isWhiteSpace = WHITE_SPACE.test(chr);
      this.addCharacter(chr, nextChar);

      this.chordLyricsPair.lyrics += lyricsLine[c] || '';
      this.processingText = !isWhiteSpace;
    }
  }

  addCharacter(chr, nextChar) {
    const isWhiteSpace = WHITE_SPACE.test(chr);

    if (!isWhiteSpace) {
      this.ensureChordLyricsPairInitialized();
    }

    if (!isWhiteSpace || this.shouldAddCharacterToChords(nextChar)) {
      this.chordLyricsPair.chords += chr;
    }
  }

  shouldAddCharacterToChords(nextChar) {
    return (nextChar && WHITE_SPACE.test(nextChar));
  }

  ensureChordLyricsPairInitialized() {
    if (!this.processingText) {
      this.chordLyricsPair = this.songLine.addChordLyricsPair();
      this.processingText = true;
    }
  }
}
