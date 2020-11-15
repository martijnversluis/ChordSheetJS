import { CHORUS, NONE, VERSE } from '../constants';

import Tag, {
  COMMENT,
  END_OF_CHORUS,
  END_OF_VERSE,
  START_OF_CHORUS,
  START_OF_VERSE,
} from '../chord_sheet/tag';
import ChordSheetParser from './chord_sheet_parser';

const VERSE_LINE_REGEX = /^\[Verse.*]/;
const CHORUS_LINE_REGEX = /^\[Chorus]/;
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
  parseLine(line) {
    if (this.isSectionEnd()) {
      this.endSection();
    }

    if (VERSE_LINE_REGEX.test(line)) {
      this.startNewLine();
      this.startSection(VERSE);
    } else if (CHORUS_LINE_REGEX.test(line)) {
      this.startNewLine();
      this.startSection(CHORUS);
    } else if (OTHER_METADATA_LINE_REGEX.test(line)) {
      this.startNewLine();
      this.endSection();
      const comment = line.match(OTHER_METADATA_LINE_REGEX)[1];
      this.songLine.addTag(new Tag(COMMENT, comment));
    } else {
      super.parseLine(line);
    }
  }

  isSectionEnd() {
    return this.songLine && this.songLine.isEmpty() && this.song.previousLine && !this.song.previousLine.isEmpty();
  }

  endOfSong() {
    super.endOfSong();
    if (this.currentSectionType in endSectionTags) {
      this.startNewLine();
    }
    this.endSection({ addNewLine: false });
  }

  startSection(sectionType) {
    if (this.currentSectionType) {
      this.endSection();
    }

    this.currentSectionType = sectionType;
    this.song.setCurrentLineType(sectionType);

    if (sectionType in startSectionTags) {
      this.song.addTag(new Tag(startSectionTags[sectionType]));
    }
  }

  endSection({ addNewLine = true } = {}) {
    if (this.currentSectionType in endSectionTags) {
      this.song.addTag(new Tag(endSectionTags[this.currentSectionType]));

      if (addNewLine) {
        this.startNewLine();
      }
    }

    this.song.setCurrentLineType(NONE);
    this.currentSectionType = null;
  }

  startNewLine() {
    this.songLine = this.song.addLine();
  }
}

export default UltimateGuitarParser;
