import Song from '../chord_sheet/song';
import Line from '../chord_sheet/line';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';

const WHITE_SPACE = /\s/;
const CHORD_LINE_REGEX = /^\s*((([A-G])(#|b)?([^/\s]*)(\/([A-G])(#|b)?)?)(\s|$)+)+(\s|$)+/;

/**
 * Parses a normal chord sheet
 */
class ChordSheetParser {
  processingText: boolean = true;

  preserveWhitespace: boolean = true;

  song?: Song;

  songLine?: Line;

  chordLyricsPair?: ChordLyricsPair;

  lines: string[] = [];

  currentLine: number = 0;

  lineCount: number = 0;

  /**
   * Instantiate a chord sheet parser
   * @param {Object} [options={}] options
   * @param {boolean} [options.preserveWhitespace=true] whether to preserve trailing whitespace for chords
   */
  constructor({ preserveWhitespace = true } = {}) {
    this.preserveWhitespace = (preserveWhitespace === true);
  }

  /**
   * Parses a chord sheet into a song
   * @param {string} chordSheet The ChordPro chord sheet
   * @param {Object} [options={}] Optional parser options
   * @param {Song} [options.song=null] The {@link Song} to store the song data in
   * @returns {Song} The parsed song
   */
  parse(chordSheet, { song = null } = {}) {
    this.initialize(chordSheet, { song });

    while (this.hasNextLine()) {
      const line = this.readLine();
      this.parseLine(line);
    }

    this.endOfSong();
    return this.song;
  }

  endOfSong() { }

  parseLine(line) {
    this.songLine = this.song.addLine();

    if (line.trim().length === 0) {
      this.chordLyricsPair = null;
    } else {
      this.parseNonEmptyLine(line);
    }
  }

  parseNonEmptyLine(line) {
    this.chordLyricsPair = this.songLine.addChordLyricsPair();

    if (CHORD_LINE_REGEX.test(line) && this.hasNextLine()) {
      const nextLine = this.readLine();
      this.parseLyricsWithChords(line, nextLine);
    } else {
      this.chordLyricsPair.lyrics = `${line}`;
    }
  }

  initialize(document, { song = null } = {}) {
    this.song = (song || new Song());
    this.lines = document.split('\n');
    this.currentLine = 0;
    this.lineCount = this.lines.length;
    this.processingText = true;
  }

  readLine() {
    const line = this.lines[this.currentLine];
    this.currentLine += 1;
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
    for (let c = 0, charCount = chordsLine.length; c < charCount; c += 1) {
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
    return (nextChar && WHITE_SPACE.test(nextChar) && this.preserveWhitespace);
  }

  ensureChordLyricsPairInitialized() {
    if (!this.processingText) {
      this.chordLyricsPair = this.songLine.addChordLyricsPair();
      this.processingText = true;
    }
  }
}

export default ChordSheetParser;
