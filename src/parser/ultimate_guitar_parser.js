import ChordSheetParser from './chord_sheet_parser';
import { CHORUS, NONE, VERSE } from '../constants';
import {
  END_OF_CHORUS,
  END_OF_VERSE,
  START_OF_CHORUS,
  START_OF_VERSE,
} from '../chord_sheet/tag';

const noop = () => {};
const logger =
  process && process.env === 'development'
    ? console
    : {
      debug: noop,
      error: noop,
      info: noop,
    };

const VERSE_LINE_REGEX = /^\[Verse.*\]/;
const CHORUS_LINE_REGEX = /^\[Chorus\]/;
const OTHER_METADATA_LINE_REGEX = /^\[([^\]]+)\]/;

const sectionTypeToStartTag = {
  [CHORUS]: START_OF_CHORUS,
  [VERSE]: START_OF_VERSE,
};

const sectionTypeToEndTag = {
  [CHORUS]: END_OF_CHORUS,
  [VERSE]: END_OF_VERSE,
};

/**
 * Parses an Ultimate Guitar chord sheet with metadata
 */
export default class UltimateGuitarParser extends ChordSheetParser {
  parse(ultimateGuitarChordSheet) {
    this.currentSectionType = NONE;
    const song = super.parse(ultimateGuitarChordSheet);
    this.endCurrentSection();
    return song;
  }

  startSection(type) {
    this.endCurrentSection();

    logger.debug(`Starting ${type} section`);

    if (type in sectionTypeToStartTag) {
      const startTag = sectionTypeToStartTag[type];
      logger.debug(`Adding section start tag ${startTag}`);
      this.song.addTag(startTag);
    } else {
      logger.debug(`Unknown start tag for ${type} section, adding as comment`);
      this.song.addTag(`comment: ${type}`);
    }

    this.currentSectionType = type;
  }

  endSection(type) {
    logger.debug(`Ending ${type} section`);

    if (type in sectionTypeToEndTag) {
      const endTag = sectionTypeToEndTag[type];
      logger.debug(`Adding section end tag ${endTag}`);
      this.song.addLine();
      this.song.addTag(endTag);
    } else {
      logger.debug(`Unknown end tag for ${type} section, ignoring`);
    }

    this.currentSectionType = NONE;
  }

  endCurrentSection() {
    if (this.currentSectionType === NONE) {
      logger.debug('No current section to end');
      return;
    }

    this.endSection(this.currentSectionType);
  }

  parseLine(line) {
    if (line.trim().length === 0) {
      this.endCurrentSection();
    }

    return super.parseLine(line);
  }

  parseNonEmptyLine(line) {
    if (VERSE_LINE_REGEX.test(line)) {
      this.startSection(VERSE);
    } else if (CHORUS_LINE_REGEX.test(line)) {
      this.startSection(CHORUS);
    } else if (OTHER_METADATA_LINE_REGEX.test(line)) {
      this.startSection(line.match(OTHER_METADATA_LINE_REGEX)[1]);
    } else {
      super.parseNonEmptyLine(line);
    }
  }
}
