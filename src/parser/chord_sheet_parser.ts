/* eslint max-len: 0 */
import Song from '../chord_sheet/song';
import Line from '../chord_sheet/line';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import { deprecate, normalizeLineEndings } from '../utilities';

const WHITE_SPACE = /\s/;
const CHORD_LINE_REGEX = /^\s*((([A-G|Do|Re|Mi|Fa|Sol|La|Si])(#|b)?([^/\s]*)(\/([A-G|Do|Re|Mi|Fa|Sol|La|Si])(#|b)?)?)(\s|$)+)+(\s|$)+/;

/**
 * Parses a normal chord sheet
 *
 * ChordSheetParser is deprecated, please use ChordsOverWordsParser.
 *
 * ChordsOverWordsParser aims to support any kind of chord, whereas ChordSheetParser lacks
 * support for many variations. Besides that, some chordpro feature have been ported back
 * to ChordsOverWordsParser, which adds some interesting functionality.
 */
class ChordSheetParser {
  processingText = true;

  preserveWhitespace = true;

  song: Song = new Song();

  songLine: Line | null = null;

  chordLyricsPair: ChordLyricsPair | null = null;

  lines: string[] = [];

  currentLine = 0;

  lineCount = 0;

  /**
   * Instantiate a chord sheet parser
   * ChordSheetParser is deprecated, please use ChordsOverWordsParser.
   * @param {Object} [options={}] options
   * @param {boolean} [options.preserveWhitespace=true] whether to preserve trailing whitespace for chords
   * @deprecated
   */
  constructor(
    { preserveWhitespace = true }: { preserveWhitespace?: boolean } = {},
    showDeprecationWarning: boolean = true,
  ) {
    if (showDeprecationWarning) {
      deprecate(
        `ChordSheetParser is deprecated, please use ChordsOverWordsParser.

  ChordsOverWordsParser aims to support any kind of chord, whereas ChordSheetParser lacks
  support for many variations. Besides that, some chordpro feature have been ported back
  to ChordsOverWordsParser, which adds some interesting functionality.`,
      );
    }

    this.preserveWhitespace = preserveWhitespace;
  }

  /**
   * Parses a chord sheet into a song
   * @param {string} chordSheet The ChordPro chord sheet
   * @param {Object} [options={}] Optional parser options
   * @param {Song} [options.song=null] The {@link Song} to store the song data in
   * @returns {Song} The parsed song
   */
  parse(chordSheet: string, { song }: { song?: Song } = {}): Song {
    this.initialize(chordSheet, song);

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
    if (!this.songLine) throw new Error('Expected this.songLine to be present');

    this.chordLyricsPair = this.songLine.addChordLyricsPair();

    if (CHORD_LINE_REGEX.test(line) && this.hasNextLine()) {
      const nextLine = this.readLine();
      this.parseLyricsWithChords(line, nextLine);
    } else {
      this.chordLyricsPair.lyrics = `${line}`;
    }
  }

  initialize(document, song: Song | null = null) {
    if (song) {
      this.song = song;
    }

    this.lines = normalizeLineEndings(document).split('\n');
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

    if (!this.chordLyricsPair) throw new Error('Expected this.chordLyricsPair to be present');

    this.chordLyricsPair.lyrics += lyricsLine.substring(chordsLine.length);
    this.chordLyricsPair.chords = this.chordLyricsPair.chords.trim();

    if (this.chordLyricsPair.lyrics) {
      this.chordLyricsPair.lyrics = this.chordLyricsPair.lyrics.trim();
    }

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

      if (!this.chordLyricsPair) throw new Error('Expected this.chordLyricsPair to be present');

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
      if (!this.chordLyricsPair) throw new Error('Expected this.chordLyricsPair to be present');
      this.chordLyricsPair.chords += chr;
    }
  }

  shouldAddCharacterToChords(nextChar) {
    return (nextChar && WHITE_SPACE.test(nextChar) && this.preserveWhitespace);
  }

  ensureChordLyricsPairInitialized() {
    if (!this.processingText) {
      if (!this.songLine) throw new Error('Expected this.songLine to be present');
      this.chordLyricsPair = this.songLine.addChordLyricsPair();
      this.processingText = true;
    }
  }
}

export default ChordSheetParser;
