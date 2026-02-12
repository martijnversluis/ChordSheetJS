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
      this.parseBridgeDirective(line) ||
      this.parsePartDirective(line) ||
      this.parseUGMetadata(line) ||
      this.parseMetadata(line)
    )) {
      super.parseLine(line);
    }
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
