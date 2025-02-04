import { CHORUS, NONE, VERSE } from '../constants';
import ChordSheetParser from './chord_sheet_parser';
import {
  COMMENT, END_OF_CHORUS, END_OF_VERSE, START_OF_CHORUS, START_OF_VERSE,
} from '../chord_sheet/tags';
import Tag from '../chord_sheet/tag';

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

  parseLine(line): void {
    if (this.isSectionEnd()) {
      this.endSection();
    }

    if (VERSE_LINE_REGEX.test(line)) {
      this.startNewLine();
      const label = line.match(VERSE_LINE_REGEX)[1];
      this.startSection(VERSE, label);
    } else if (CHORUS_LINE_REGEX.test(line)) {
      this.startNewLine();
      const label = line.match(CHORUS_LINE_REGEX)[1];
      this.startSection(CHORUS, label);
    } else if (OTHER_METADATA_LINE_REGEX.test(line)) {
      this.parseMetadataLine(line);
    } else {
      super.parseLine(line);
    }
  }

  private parseMetadataLine(line) {
    this.startNewLine();
    this.endSection();
    const comment = line.match(OTHER_METADATA_LINE_REGEX)[1];

    if (!this.songLine) throw new Error('Expected this.songLine to be present');

    this.songLine.addTag(new Tag(COMMENT, comment));
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
