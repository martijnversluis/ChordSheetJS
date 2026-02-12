import ChordSheetParser from './chord_sheet_parser';
import Tag, { META_TAGS } from '../chord_sheet/tag';

import {
  BRIDGE, CHORUS, NONE, PART, VERSE,
} from '../constants';

import {
  CAPO,
  COMMENT,
  END_OF_BRIDGE,
  END_OF_CHORUS,
  END_OF_PART,
  END_OF_VERSE,
  START_OF_BRIDGE,
  START_OF_CHORUS,
  START_OF_PART,
  START_OF_VERSE,
} from '../chord_sheet/tags';

const VERSE_LINE_REGEX = /^\[(Verse.*)]/i;
const CHORUS_LINE_REGEX = /^\[(Chorus.*)]/i;
const BRIDGE_LINE_REGEX = /^\[(Bridge.*)]/i;
const PART_LINE_REGEX = /^\[(Intro|Outro|Instrumental|Interlude|Solo|Pre-Chorus)( \d+)?]/i;
const UG_METADATA_REGEX = /^(\w+):\s*(.+)$/;
const OTHER_METADATA_LINE_REGEX = /^\[([^\]]+)]/;
const REPEAT_NOTATION_REGEX = /\s+(x\d+)\s*$/i;
// eslint-disable-next-line max-len
const CHORD_LINE_REGEX = /^\s*((([A-G|Do|Re|Mi|Fa|Sol|La|Si])(#|b)?([^/\s]*)(\/([A-G|Do|Re|Mi|Fa|Sol|La|Si])(#|b)?)?)(\s|$)+)+(\s|$)+/;

const startSectionTags: Record<string, string> = {
  [VERSE]: START_OF_VERSE,
  [CHORUS]: START_OF_CHORUS,
  [BRIDGE]: START_OF_BRIDGE,
  [PART]: START_OF_PART,
};

const endSectionTags: Record<string, string> = {
  [VERSE]: END_OF_VERSE,
  [CHORUS]: END_OF_CHORUS,
  [BRIDGE]: END_OF_BRIDGE,
  [PART]: END_OF_PART,
};

/**
 * Parses an Ultimate Guitar chord sheet with metadata
 * Inherits from {@link ChordSheetParser}
 */
class UltimateGuitarParser extends ChordSheetParser {
  currentSectionType: string | null = null;

  pendingRepeatNotation: string | null = null;

  /**
   * Instantiate a chord sheet parser
   * @param {Object} [options={}] options
   * @param {boolean} [options.preserveWhitespace=true] whether to preserve trailing whitespace for chords
   */
  constructor({ preserveWhitespace = true }: { preserveWhitespace?: boolean } = {}) {
    super({ preserveWhitespace }, false);
  }

  parseLine(line: string): void {
    if (this.isSectionEnd()) {
      this.endSection();
    }

    const { cleanLine, repeatNotation } = this.extractRepeatNotation(line);
    this.pendingRepeatNotation = repeatNotation;

    if (!(
      this.parseVerseDirective(cleanLine) ||
      this.parseChorusDirective(cleanLine) ||
      this.parseBridgeDirective(cleanLine) ||
      this.parsePartDirective(cleanLine) ||
      this.parseUGMetadata(cleanLine) ||
      this.parseMetadata(cleanLine)
    )) {
      this.parseRegularLine(cleanLine);
    }
  }

  private parseRegularLine(line: string): void {
    this.songLine = this.songBuilder.addLine();

    if (line.trim().length === 0) {
      this.chordLyricsPair = null;
    } else {
      this.parseNonEmptyLine(line);
    }
  }

  parseNonEmptyLine(line: string): void {
    if (!this.songLine) throw new Error('Expected this.songLine to be present');

    this.chordLyricsPair = this.songLine.addChordLyricsPair();
    const isChordLine = CHORD_LINE_REGEX.test(line);

    if (isChordLine && this.hasNextLine()) {
      this.parseChordLineWithNextLine(line);
    } else if (isChordLine) {
      this.parseChordsOnly(line);
    } else {
      this.chordLyricsPair.lyrics = `${line}`;
    }
  }

  private parseChordLineWithNextLine(chordsLine: string): void {
    const nextLine = this.readLine();

    if (this.isDirectiveLine(nextLine)) {
      this.parseChordsOnly(chordsLine);
      this.unreadLine();
    } else {
      this.parseLyricsWithChords(chordsLine, nextLine);
    }
  }

  private unreadLine(): void {
    this.currentLine -= 1;
  }

  private isDirectiveLine(line: string): boolean {
    return VERSE_LINE_REGEX.test(line) ||
      CHORUS_LINE_REGEX.test(line) ||
      BRIDGE_LINE_REGEX.test(line) ||
      PART_LINE_REGEX.test(line) ||
      OTHER_METADATA_LINE_REGEX.test(line) ||
      line.trim().length === 0;
  }

  private parseChordsOnly(chordsLine: string): void {
    this.parseLyricsWithChords(chordsLine, '');
    this.applyRepeatNotation();
  }

  parseLyricsWithChords(chordsLine: string, lyricsLine: string): void {
    this.processCharacters(chordsLine, lyricsLine);

    if (!this.chordLyricsPair) throw new Error('Expected this.chordLyricsPair to be present');

    this.chordLyricsPair.lyrics += lyricsLine.substring(chordsLine.length);
    this.chordLyricsPair.chords = this.chordLyricsPair.chords.trim();

    if (this.chordLyricsPair.lyrics) {
      this.chordLyricsPair.lyrics = this.chordLyricsPair.lyrics.trim();
    }

    this.applyRepeatNotation();
  }

  processCharacters(chordsLine: string, lyricsLine: string): void {
    for (let c = 0, charCount = chordsLine.length; c < charCount; c += 1) {
      const chr = chordsLine[c];
      const nextChar = chordsLine[c + 1];
      const isWhiteSpace = /\s/.test(chr);
      this.addCharacter(chr, nextChar);

      if (!this.chordLyricsPair) throw new Error('Expected this.chordLyricsPair to be present');

      this.chordLyricsPair.lyrics += lyricsLine[c] || '';
      this.processingText = !isWhiteSpace;
    }
  }

  addCharacter(chr: string, nextChar: string): void {
    const isWhiteSpace = /\s/.test(chr);

    if (!isWhiteSpace) {
      this.ensureChordLyricsPairInitialized();
    }

    if (!isWhiteSpace || this.shouldAddCharacterToChords(nextChar)) {
      if (!this.chordLyricsPair) throw new Error('Expected this.chordLyricsPair to be present');
      this.chordLyricsPair.chords += chr;
    }
  }

  shouldAddCharacterToChords(nextChar: string): boolean {
    return !!(nextChar && /\s/.test(nextChar) && this.preserveWhitespace);
  }

  ensureChordLyricsPairInitialized(): void {
    if (!this.processingText) {
      if (!this.songLine) throw new Error('Expected this.songLine to be present');
      this.chordLyricsPair = this.songLine.addChordLyricsPair();
      this.processingText = true;
    }
  }

  private extractRepeatNotation(line: string): { cleanLine: string; repeatNotation: string | null } {
    const match = line.match(REPEAT_NOTATION_REGEX);
    if (match) {
      return {
        cleanLine: line.replace(REPEAT_NOTATION_REGEX, ''),
        repeatNotation: match[1],
      };
    }
    return { cleanLine: line, repeatNotation: null };
  }

  private applyRepeatNotation(): void {
    if (!this.pendingRepeatNotation || !this.songLine) return;

    const lastItem = this.songLine.items[this.songLine.items.length - 1];
    if (lastItem && 'lyrics' in lastItem) {
      lastItem.lyrics = (lastItem.lyrics || '') + this.pendingRepeatNotation;
    }
    this.pendingRepeatNotation = null;
  }

  parseUGMetadata(line: string): boolean {
    const match = line.match(UG_METADATA_REGEX);
    if (!match) return false;

    const tagName = match[1].toLowerCase();
    if (!META_TAGS.includes(tagName)) return false;

    const value = tagName === CAPO ? this.extractCapoValue(match[2]) : match[2].trim();
    this.startNewLine();
    this.songBuilder.addTag(new Tag(tagName, value));
    return true;
  }

  private extractCapoValue(rawValue: string): string {
    const [, capoNumber] = rawValue.match(/^(\d+)/) || [];
    return capoNumber || rawValue.trim();
  }

  parseVerseDirective(line: string): boolean {
    const match = line.match(VERSE_LINE_REGEX);

    if (!match) {
      return false;
    }

    this.startNewLine();
    const label = match[1];
    this.startSection(VERSE, label);
    return true;
  }

  parseChorusDirective(line: string): boolean {
    const match = line.match(CHORUS_LINE_REGEX);

    if (!match) {
      return false;
    }

    this.startNewLine();
    const label = match[1];
    this.startSection(CHORUS, label);
    return true;
  }

  parseBridgeDirective(line: string): boolean {
    const match = line.match(BRIDGE_LINE_REGEX);

    if (!match) {
      return false;
    }

    this.startNewLine();
    const label = match[1];
    this.startSection(BRIDGE, label);
    return true;
  }

  parsePartDirective(line: string): boolean {
    const match = line.match(PART_LINE_REGEX);

    if (!match) {
      return false;
    }

    this.startNewLine();
    const label = match[1] + (match[2] || '');
    this.startSection(PART, label);
    return true;
  }

  parseMetadata(line: string): boolean {
    const match = line.match(OTHER_METADATA_LINE_REGEX);

    if (!match) {
      return false;
    }

    this.startNewLine();
    this.endSection();
    if (!this.songLine) throw new Error('Expected this.songLine to be present');

    this.songLine.addTag(new Tag(COMMENT, match[1]));

    return true;
  }

  isSectionEnd(): boolean {
    return this.songLine !== null &&
      this.songLine.isEmpty() &&
      this.songBuilder.previousLine !== null &&
      !this.songBuilder.previousLine.isEmpty();
  }

  endOfSong() {
    super.endOfSong();
    if (this.currentSectionType !== null && this.currentSectionType in endSectionTags) {
      this.startNewLine();
    }
    this.endSection({ addNewLine: false });
  }

  startSection(sectionType: string, label: string) {
    if (this.currentSectionType) {
      this.endSection();
    }

    this.currentSectionType = sectionType;
    this.songBuilder.setCurrentProperties(sectionType);

    if (sectionType in startSectionTags) {
      this.songBuilder.addTag(new Tag(startSectionTags[sectionType], label));
    }
  }

  endSection({ addNewLine = true } = {}) {
    if (this.currentSectionType !== null && this.currentSectionType in endSectionTags) {
      if (this.songLine && this.songLine.isEmpty()) {
        this.songLine.addTag(new Tag(endSectionTags[this.currentSectionType]));
      } else {
        const endTagLine = this.songBuilder.addLine();
        endTagLine.addTag(new Tag(endSectionTags[this.currentSectionType]));
      }

      if (addNewLine) {
        this.startNewLine();
      }
    }

    this.songBuilder.setCurrentProperties(NONE);
    this.currentSectionType = null;
  }

  startNewLine() {
    this.songLine = this.songBuilder.addLine();
  }
}

export default UltimateGuitarParser;
