import { CHORUS, NONE, VERSE } from '../constants';
import ChordSheetParser from './chord_sheet_parser';
import Tag from '../chord_sheet/tag';

import {
  COMMENT, END_OF_CHORUS, END_OF_VERSE, START_OF_CHORUS, START_OF_VERSE,
} from '../chord_sheet/tags';

const VERSE_LINE_REGEX = /^\[(Verse.*)]/i;
const CHORUS_LINE_REGEX = /^\[(Chorus)]/i;
const OTHER_METADATA_LINE_REGEX = /^\[([^\]]+)]/;

const startSectionTags = {
  [VERSE]: START_OF_VERSE,
  [CHORUS]: START_OF_CHORUS,
};

const endSectionTags = {
  [VERSE]: END_OF_VERSE,
  [CHORUS]: END_OF_CHORUS,
};

/**
 * Parses an Ultimate Guitar chord sheet with metadata
 * Inherits from {@link ChordSheetParser}
 */
class UltimateGuitarParser extends ChordSheetParser {
  currentSectionType: string | null = null;

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

    if (!(
      this.parseVerseDirective(line) ||
      this.parseChorusDirective(line) ||
      this.parseMetadata(line)
    )) {
      super.parseLine(line);
    }
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

  startSection(sectionType: 'verse' | 'chorus', label: string) {
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
      this.songBuilder.addTag(new Tag(endSectionTags[this.currentSectionType]));

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
